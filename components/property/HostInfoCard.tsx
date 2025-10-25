import React from 'react';
import { HostProfile } from '../../types';

interface HostInfoCardProps {
  host: HostProfile;
}

const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>;

const HostInfoCard: React.FC<HostInfoCardProps> = ({ host }) => {
  return (
    <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Hosted by {host.name}</h2>
        <div className="flex items-center space-x-4">
            <img src={host.profileImage} alt={host.name} className="w-16 h-16 rounded-full object-cover" />
            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{host.name}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <StarIcon />
                    <span className="ml-1 font-bold">{host.rating}</span>
                    <span className="mx-2">·</span>
                    <span>Response time: {host.responseTime}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HostInfoCard;
