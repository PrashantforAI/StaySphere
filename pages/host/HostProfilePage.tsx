import React from 'react';

const HostProfilePage: React.FC = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold">Coming Soon!</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          This is where you'll be able to manage your host profile, payment details, and account settings.
        </p>
      </div>
    </div>
  );
};

export default HostProfilePage;