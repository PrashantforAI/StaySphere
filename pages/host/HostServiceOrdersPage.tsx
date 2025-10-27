import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getServiceBookingsForHost } from '../../services/firestoreService';
import { ServiceBooking, ServiceBookingStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import ServiceBookingCard from '../../components/service_provider/ServiceBookingCard';

type OrderCategory = 'active' | 'past';

const HostServiceOrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderCategory>('active');

  useEffect(() => {
    if (currentUser) {
      getServiceBookingsForHost(currentUser.uid)
        .then(setBookings)
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  const filteredBookings = bookings.filter(b => {
      const isActive = b.status === ServiceBookingStatus.REQUESTED || b.status === ServiceBookingStatus.APPLIED || b.status === ServiceBookingStatus.ACCEPTED;
      return activeTab === 'active' ? isActive : !isActive;
  });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">My Service Orders</h1>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('active')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'active' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Active
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
            <ServiceBookingCard key={booking.serviceBookingId} booking={booking} userType="host" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No {activeTab} service orders</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Find a professional in the Service Marketplace to get started.</p>
        </div>
      )}
    </div>
  );
};

export default HostServiceOrdersPage;