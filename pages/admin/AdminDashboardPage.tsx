import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { ROUTES } from '../../constants';

const StatCard: React.FC<{ title: string; value: string; link: string; }> = ({ title, value, link }) => (
    <Link to={link} className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </Link>
);


const AdminDashboardPage: React.FC = () => {
    // Dummy stats for demonstration
    const stats = {
        totalUsers: 1523,
        totalProperties: 489,
        pendingProviders: 3,
        totalBookings: 2109,
    };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} link="#" />
            <StatCard title="Listed Properties" value={stats.totalProperties.toLocaleString()} link="#" />
            <StatCard title="Pending Providers" value={stats.pendingProviders.toString()} link={ROUTES.ADMIN_PROVIDER_APPROVALS} />
            <StatCard title="Total Bookings" value={stats.totalBookings.toLocaleString()} link="#" />
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-4">
                 <Link to={ROUTES.ADMIN_PROVIDER_APPROVALS} className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700">
                    Manage Provider Approvals
                </Link>
                 <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold rounded-lg shadow-md">
                    View Reports (Coming Soon)
                </button>
            </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboardPage;
