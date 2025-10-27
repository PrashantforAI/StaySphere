import React from 'react';

const HostMessagesPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold">Coming Soon!</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          This is where you'll manage your conversations with guests.
        </p>
      </div>
    </div>
  );
};

export default HostMessagesPage;