import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { getServiceBookingsForProvider, getOpenServiceRequests } from '../../services/firestoreService';
import { ServiceBooking, ServiceBookingStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import ServiceBookingCard from '../../components/service_provider/ServiceBookingCard';

type JobCategory = 'new' | 'upcoming' | 'past';

const ProviderJobsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [myBookings, setMyBookings] = useState<ServiceBooking[]>([]);
  const [openRequests, setOpenRequests] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<JobCategory>('new');

  useEffect(() => {
    if (currentUser) {
        setLoading(true);
        Promise.all([
            getServiceBookingsForProvider(currentUser.uid),
            getOpenServiceRequests(),
        ]).then(([providerBookings, allOpenRequests]) => {
            setMyBookings(providerBookings);
            setOpenRequests(allOpenRequests);
        }).finally(() => setLoading(false));
    }
  }, [currentUser]);

  const getFilteredBookings = () => {
      switch (activeTab) {
          case 'new':
              return openRequests; // Show all open requests for application
          case 'upcoming':
              return myBookings.filter(b => b.status === ServiceBookingStatus.ACCEPTED);
          case 'past':
              return myBookings.filter(b => b.status === ServiceBookingStatus.COMPLETED || b.status === ServiceBookingStatus.CANCELLED);
          default:
              return [];
      }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">My Jobs</h1>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('new')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'new' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    New Requests
                </button>
                <button onClick={() => setActiveTab('upcoming')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Upcoming
                </button>
                <button onClick={() => setActiveTab('past')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Past
                </button>
            </nav>
        </div>

        {loading ? (
          <div className="flex justify-center mt-12"><Spinner /></div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map(booking => (
              <ServiceBookingCard key={booking.serviceBookingId} booking={booking} userType="provider" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No jobs in this category</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                {activeTab === 'new' ? "Check back later for new service requests." : `You have no ${activeTab} jobs.`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderJobsPage;
