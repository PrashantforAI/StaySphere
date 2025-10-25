
import React from 'react';
import Header from '../../components/layout/Header';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const EarningsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Earnings</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This feature is coming soon! You'll be able to track your earnings, view payout history, and see performance analytics here.
        </p>
        <Link to={ROUTES.HOST_PROPERTIES} className="text-primary-600 hover:underline">
            Go back to My Properties
        </Link>
      </main>
    </div>
  );
};

export default EarningsPage;
