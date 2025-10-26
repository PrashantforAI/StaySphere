import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';
import { ServiceProviderProfile, ServiceSpecialty, UserRole } from '../types';
import { updateUserRole, updateServiceProviderProfile } from '../services/firestoreService';
import { uploadImage } from '../services/storageService';
import { verifyDocumentWithAI, VerificationResult } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06L10.5 12.94l-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l3.36-3.36Z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>;

// --- Helper Functions and Types ---
const fileToB64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

type DocumentState = {
    file: File | null;
    status: 'pending' | 'uploading' | 'verifying' | 'success' | 'error';
    verificationResult: VerificationResult | null;
};

// --- Page Configuration ---
const specialties: ServiceSpecialty[] = ['cleaning', 'plumbing', 'electrical', 'photography', 'catering', 'pest_control'];
const pageConfig = {
    [UserRole.HOST]: {
        title: "Become a Host",
        description: "Start earning by listing your property. First, we need to verify your identity and proof of ownership.",
        documents: [
            { id: 'govId', label: 'Government ID', description: 'PAN or Aadhaar Card' },
            { id: 'propertyDeed', label: 'Proof of Property Ownership', description: 'e.g., Sale Deed, Utility Bill' },
        ],
    },
    [UserRole.SERVICE_PROVIDER]: {
        title: "Become a Service Provider",
        description: "Offer your professional services to our hosts. Let's get you set up and verified.",
        documents: [
            { id: 'govId', label: 'Government ID', description: 'PAN or Aadhaar Card' },
            { id: 'businessLicense', label: 'Business Registration (Optional)', description: 'e.g., GST Certificate' },
        ],
    },
};

// --- Main Component ---
interface BecomeRolePageProps {
    targetRole: UserRole.HOST | UserRole.SERVICE_PROVIDER;
}

const BecomeRolePage: React.FC<BecomeRolePageProps> = ({ targetRole }) => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const config = pageConfig[targetRole];

    // State
    const [documents, setDocuments] = useState<Record<string, DocumentState>>(
        config.documents.reduce((acc, doc) => ({...acc, [doc.id]: { file: null, status: 'pending', verificationResult: null }}), {})
    );
    // Form state for SPs
    const [spProfile, setSpProfile] = useState({ specialties: [], locations: '', bio: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (id: string, file: File | null) => {
        setDocuments(prev => ({...prev, [id]: { file, status: file ? 'pending' : 'pending', verificationResult: null }}));
    };
    
    const handleSpecialtyToggle = (specialty: ServiceSpecialty) => {
        setSpProfile(prev => ({...prev, specialties: prev.specialties.includes(specialty) ? prev.specialties.filter(s => s !== specialty) : [...prev.specialties, specialty] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        if (!currentUser) return;

        // --- AI Verification Step ---
        const allDocsValid = await verifyAllDocuments();
        if (!allDocsValid) {
            setError("Some documents could not be verified. Please review the errors and try again.");
            setIsSubmitting(false);
            return;
        }

        // --- Firestore Update Step ---
        try {
            if (targetRole === UserRole.SERVICE_PROVIDER) {
                await updateUserRole(currentUser.uid, UserRole.SERVICE_PROVIDER);
                await updateServiceProviderProfile(currentUser.uid, {
                    specialties: spProfile.specialties as ServiceSpecialty[],
                    serviceLocations: spProfile.locations.split(',').map(l => l.trim()).filter(Boolean),
                    bio: spProfile.bio,
                });
            } else {
                await updateUserRole(currentUser.uid, UserRole.HOST);
            }
            alert(`Congratulations! You are now a ${targetRole.replace('_', ' ')}.`);
            // A small delay to allow the AuthContext to refresh with the new role
            setTimeout(() => window.location.hash = ROUTES.DASHBOARD, 1000);
        } catch (err) {
            console.error(err);
            setError("There was an issue updating your role. Please contact support.");
            setIsSubmitting(false);
        }
    };
    
    const verifyAllDocuments = async (): Promise<boolean> => {
        let allValid = true;
        for (const docId of Object.keys(documents)) {
            const docState = documents[docId];
            if (!docState.file) continue; // Skip optional docs
            
            setDocuments(prev => ({ ...prev, [docId]: { ...docState, status: 'verifying' } }));
            try {
                const b64 = await fileToB64(docState.file);
                const result = await verifyDocumentWithAI(b64, docState.file.type, config.documents.find(d => d.id === docId)?.label || 'document');
                setDocuments(prev => ({...prev, [docId]: {...docState, status: result.isDocumentValid ? 'success' : 'error', verificationResult: result }}));
                if (!result.isDocumentValid) allValid = false;
            } catch (err) {
                 setDocuments(prev => ({...prev, [docId]: {...docState, status: 'error', verificationResult: { isDocumentValid: false, documentType: 'Error', validationSummary: 'Verification failed.' }}}));
                 allValid = false;
            }
        }
        return allValid;
    };


    const renderDocumentUploader = (id: string, label: string, description: string) => {
        const docState = documents[id];
        return (
            <div key={id}>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{description}</p>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={e => handleFileChange(id, e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {docState.status !== 'pending' && docState.status !== 'uploading' && (
                    <div className="mt-2 flex items-center gap-2 p-2 rounded-md text-sm bg-gray-100 dark:bg-gray-700/50">
                        {docState.status === 'verifying' && <><Spinner /> Verifying with AI...</>}
                        {docState.status === 'success' && <><CheckCircleIcon /> {docState.verificationResult?.validationSummary}</>}
                        {docState.status === 'error' && <><XCircleIcon /> {docState.verificationResult?.rejectionReason || docState.verificationResult?.validationSummary || "Verification failed"}</>}
                    </div>
                )}
            </div>
        );
    };
    
    const renderSPForm = () => (
      <>
        <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Specialties</label>
            <div className="flex flex-wrap gap-2">
                {specialties.map(s => (
                    <button type="button" key={s} onClick={() => handleSpecialtyToggle(s)} className={`capitalize px-3 py-1 rounded-full text-sm font-medium border-2 transition-colors ${spProfile.specialties.includes(s) ? 'bg-primary-600 text-white border-primary-600' : 'bg-transparent border-gray-300 dark:border-gray-600 hover:border-primary-500'}`}>
                        {s.replace('_', ' ')}
                    </button>
                ))}
            </div>
        </div>
        <div>
            <label htmlFor="locations" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Service Locations</label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Enter cities, separated by commas.</p>
            <input id="locations" type="text" value={spProfile.locations} onChange={e => setSpProfile(p=>({...p, locations: e.target.value}))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div>
            <label htmlFor="bio" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">About You</label>
             <textarea id="bio" value={spProfile.bio} onChange={e => setSpProfile(p=>({...p, bio: e.target.value}))} rows={4} maxLength={300} className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
      </>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow container mx-auto flex flex-col justify-center items-center p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{config.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{config.description}</p>

                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {config.documents.map(doc => renderDocumentUploader(doc.id, doc.label, doc.description))}
                        {targetRole === UserRole.SERVICE_PROVIDER && renderSPForm()}

                        <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 disabled:opacity-50 flex justify-center items-center gap-2">
                            {isSubmitting ? <><Spinner/> Submitting for Verification...</> : 'Submit Application'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default BecomeRolePage;