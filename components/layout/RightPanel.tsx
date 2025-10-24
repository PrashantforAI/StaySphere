
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const RightPanel: React.FC = () => {
  const { userProfile } = useAuth();
  
  return (
    <div className="h-full bg-gray-100 dark:bg-black p-4 md:p-8 overflow-y-auto">
      <div className="text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-2">
          Hello, {userProfile?.displayName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Here's what's happening. You can view properties, manage bookings, or chat with the AI assistant.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder Content Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-2">Explore Properties</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Browse our curated list of vacation rentals across India.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-2">Manage Bookings</h3>
            <p className="text-gray-600 dark:text-gray-400">
              View your upcoming and past trips in one place.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-2">Host Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400">
              If you're a host, manage your listings and availability here.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI assistant in the center panel is ready to help you 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
