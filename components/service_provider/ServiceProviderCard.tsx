import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceProviderProfile } from '../../types';
import { ROUTES } from '../../constants';

interface ServiceProviderCardProps {
  provider: ServiceProviderProfile;
}

const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>;

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider }) => {
  const profileUrl = ROUTES.PROVIDER_PROFILE.replace(':providerId', provider.providerId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <img className="w-20 h-20 rounded-full object-cover" src={provider.profileImage} alt={provider.displayName} />
          <div className="flex-grow">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{provider.displayName}</h3>
            <div className="flex items-center space-x-1 mt-1">
                <StarIcon />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{provider.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({provider.reviewCount} reviews)</span>
            </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Serves: {provider.serviceLocations.join(', ')}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {provider.specialties.map(specialty => (
              <span key={specialty} className="capitalize text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-2.5 py-0.5 rounded-full">
                {specialty.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 h-10 overflow-hidden text-ellipsis">{provider.bio}</p>
      </div>
      <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <Link to={profileUrl} className="w-full text-center block bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ServiceProviderCard;
