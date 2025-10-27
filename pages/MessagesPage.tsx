import React from 'react';
import Header from '../components/layout/Header';

const MessagesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold">Coming Soon!</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                This is where you'll manage your conversations with hosts and service providers.
                </p>
            </div>
        </main>
    </div>
  );
};

export default MessagesPage;
