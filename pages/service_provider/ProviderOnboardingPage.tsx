import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import { ServiceSpecialty } from '../../types';

const specialties: ServiceSpecialty[] = ['cleaning', 'plumbing', 'electrical', 'photography', 'catering', 'pest_control'];

const ProviderOnboardingPage: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedSpecialties, setSelectedSpecialties] = useState<ServiceSpecialty[]>([]);
  const [locations, setLocations] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSpecialtyToggle = (specialty: ServiceSpecialty) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
      ? prev.filter(s => s !== specialty) 
      : [...prev, specialty]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In a real app, you would save this data to Firestore
    console.log({
      providerId: userProfile?.userId,
      specialties: selectedSpecialties,
      locations: locations.split(',').map(l => l.trim()),
      bio,
    });
    // Simulate API call
    await new Promise(res => setTimeout(res, 1000));
    alert("Profile submitted for approval! You will be notified once it's reviewed.");
    setSubmitting(false);
    navigate(ROUTES.PROVIDER_DASHBOARD);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto flex flex-col justify-center items-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to StaySphere!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Let's set up your service provider profile.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Specialties</label>
                <div className="flex flex-wrap gap-2">
                    {specialties.map(s => (
                        <button
                            type="button"
                            key={s}
                            onClick={() => handleSpecialtyToggle(s)}
                            className={`capitalize px-3 py-1 rounded-full text-sm font-medium border-2 transition-colors ${selectedSpecialties.includes(s) ? 'bg-primary-600 text-white border-primary-600' : 'bg-transparent border-gray-300 dark:border-gray-600 hover:border-primary-500'}`}
                        >
                            {s.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>
            
             <div>
                <label htmlFor="locations" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Service Locations</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Enter the cities you operate in, separated by commas (e.g., Mumbai, Pune).</p>
                <input
                    id="locations"
                    type="text"
                    value={locations}
                    onChange={e => setLocations(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                />
            </div>

            <div>
                <label htmlFor="bio" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">About You / Your Business</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Briefly describe your services (max 300 characters).</p>
                 <textarea
                    id="bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={4}
                    maxLength={300}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                />
            </div>
            
            <p className="text-xs text-gray-500">In a full version, you would also upload portfolio images and verification documents here.</p>

            <button type="submit" disabled={submitting} className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProviderOnboardingPage;
