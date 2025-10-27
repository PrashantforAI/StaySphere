import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import { UserProfile } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { updateUserProfile } from '../../services/firestoreService';
import { uploadImage } from '../../services/storageService';
import { generateGuestBio } from '../../services/geminiService';

const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.11a.75.75 0 0 0 .44 1.282l5.519.542a.75.75 0 0 1 .585.645l.21 5.23a.75.75 0 0 0 1.364-.12l.21-5.23a.75.75 0 0 1 .585-.645l5.519-.542a.75.75 0 0 0 .44-1.282l-3.423-3.11-4.753-.39-1.83-4.401Z" clipRule="evenodd" /></svg>;

const GuestProfilePage: React.FC = () => {
    const { userProfile, loading } = useAuth();
    const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [aiBioLoading, setAiBioLoading] = useState(false);
    const [aiKeywords, setAiKeywords] = useState('');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userProfile) {
            setProfileData(userProfile);
        }
    }, [userProfile]);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleSave = async () => {
        if (!userProfile) return;
        setSaving(true);
        try {
            let updatedData = { ...profileData };
            if (imageFile) {
                const photoURL = await uploadImage(imageFile, `profile-images/${userProfile.userId}`);
                updatedData.profileImage = photoURL;
            }
            await updateUserProfile(userProfile.userId, updatedData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };
    
    const handleGenerateBio = async () => {
        setAiBioLoading(true);
        try {
            const newBio = await generateGuestBio(aiKeywords);
            setProfileData(prev => ({ ...prev, bio: newBio }));
            setIsAiModalOpen(false);
            setAiKeywords('');
        } catch (error) {
            console.error(error);
        } finally {
            setAiBioLoading(false);
        }
    };

    const profileCompletion = useMemo(() => {
        if (!profileData) return 0;
        const fields = [
            { key: 'profileImage', weight: 30 },
            { key: 'displayName', weight: 15 },
            { key: 'location', weight: 20 },
            { key: 'bio', weight: 35 },
        ];
        const score = fields.reduce((acc, field) => {
            return profileData[field.key as keyof UserProfile] ? acc + field.weight : acc;
        }, 0);
        return score;
    }, [profileData]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    if (!userProfile) return <div className="h-screen flex items-center justify-center">Could not load user profile.</div>;

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto max-w-4xl p-4 md:p-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">My Profile</h1>
                
                {/* Profile Completion Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="font-bold text-lg">Your profile is {profileCompletion}% complete!</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">A complete profile helps hosts get to know you.</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                        <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Profile Picture Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                         <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                {imagePreview || profileData.profileImage ? (
                                    <img src={imagePreview || profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : <UserCircleIcon />}
                            </div>
                            <div>
                                 <h3 className="font-bold text-lg">Profile Photo</h3>
                                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Upload a clear photo of yourself.</p>
                                 <label htmlFor="file-upload" className="cursor-pointer text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg shadow-sm">
                                     Upload Photo
                                 </label>
                                 <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                            </div>
                         </div>
                    </div>
                    {/* Personal Info Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-lg mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                                <input type="text" name="displayName" id="displayName" value={profileData.displayName || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                <input type="text" name="location" id="location" value={profileData.location || ''} onChange={handleInputChange} placeholder="e.g. Mumbai, India" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input type="email" name="email" id="email" value={profileData.email || ''} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-900 dark:border-gray-700 cursor-not-allowed"/>
                            </div>
                        </div>
                    </div>
                    {/* About Me Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-lg">About Me</h3>
                            <button onClick={() => setIsAiModalOpen(true)} className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-500">
                                <SparklesIcon /> Auto-write with AI
                            </button>
                        </div>
                         <textarea name="bio" rows={4} value={profileData.bio || ''} onChange={handleInputChange} placeholder="Tell hosts a little about yourself..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
                    </div>
                </div>

                <div className="mt-8 text-right">
                    <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50">
                        {saving ? <Spinner /> : 'Save Changes'}
                    </button>
                </div>

                {/* AI Bio Modal */}
                {isAiModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="text-lg font-bold">AI Bio Writer</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Enter a few keywords, and we'll write a friendly bio for you.</p>
                            <input type="text" value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)} placeholder="e.g. quiet, love reading, foodie" className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"/>
                            <div className="mt-4 flex justify-end gap-3">
                                <button onClick={() => setIsAiModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
                                <button onClick={handleGenerateBio} disabled={aiBioLoading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
                                    {aiBioLoading ? <Spinner /> : <SparklesIcon />} Generate
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default GuestProfilePage;