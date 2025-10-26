import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceProviderById } from '../services/firestoreService';
import { ServiceProviderProfile } from '../types';
import Spinner from '../components/ui/Spinner';
import Header from '../components/layout/Header';
import { ROUTES } from '../constants';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>;


const ProviderProfilePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [provider, setProvider] = useState<ServiceProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) {
        setError('Provider ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const providerData = await getServiceProviderById(providerId);
        if (providerData) {
          setProvider(providerData);
        } else {
          setError('Service provider not found.');
        }
      } catch (err) {
        setError('Failed to fetch provider details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-4 text-center">
          <h2 className="text-2xl font-bold text-red-500">{error || 'Provider not found.'}</h2>
          <Link to={ROUTES.HOST_SERVICE_MARKETPLACE} className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-4">
          <Link to={ROUTES.HOST_SERVICE_MARKETPLACE} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <ArrowLeftIcon />
            <span className="ml-2">Back to Marketplace</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <img src={provider.profileImage} alt={provider.displayName} className="w-32 h-32 rounded-full object-cover border-4 border-primary-500" />
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold">{provider.displayName}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                        <StarIcon />
                        <span className="font-bold text-lg">{provider.rating.toFixed(1)}</span>
                        <span className="text-gray-500 dark:text-gray-400">({provider.reviewCount} reviews)</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Serves: {provider.serviceLocations.join(', ')}</p>
                     <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                        {provider.specialties.map(specialty => (
                        <span key={specialty} className="capitalize text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-2.5 py-0.5 rounded-full">
                            {specialty.replace('_', ' ')}
                        </span>
                        ))}
                    </div>
                </div>
                 <div className="md:ml-auto">
                    <button className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700">
                        Request Service
                    </button>
                </div>
            </div>
            
            <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>

            <div>
                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                <p className="text-gray-700 dark:text-gray-300 prose">{provider.bio}</p>
            </div>
            
             <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                {provider.portfolio.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {provider.portfolio.map((item, index) => (
                            <div key={index} className="rounded-lg overflow-hidden shadow-md">
                                <img src={item.url} alt={item.caption} className="w-full h-48 object-cover" />
                                <p className="p-2 text-sm bg-gray-100 dark:bg-gray-700">{item.caption}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500">No portfolio items have been uploaded yet.</p>}
            </div>

        </div>

      </main>
    </div>
  );
};

export default ProviderProfilePage;
