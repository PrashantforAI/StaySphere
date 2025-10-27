import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getHostBookings } from '../services/firestoreService';
import { Booking, BookingStatus } from '../types';
import Spinner from '../components/ui/Spinner';
import BookingCard from '../components/common/BookingCard';

type BookingCategory = 'upcoming' | 'ongoing' | 'past' | 'pending';

const HostBookingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<BookingCategory>('upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;
      try {
        const hostBookings = await getHostBookings(currentUser.uid);
        setBookings(hostBookings);
      } catch (err) {
        setError('Failed to load your bookings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);
  
  const getFilteredBookings = () => {
    const now = new Date().toISOString().split('T')[0];
    switch (activeTab) {
        case 'upcoming':
            return bookings.filter(b => b.checkIn > now && b.bookingStatus === BookingStatus.CONFIRMED);
        case 'ongoing':
            return bookings.filter(b => b.checkIn <= now && b.checkOut >= now && b.bookingStatus === BookingStatus.CONFIRMED);
        case 'past':
            return bookings.filter(b => b.checkOut < now || b.bookingStatus === BookingStatus.COMPLETED || b.bookingStatus.includes('cancelled'));
        case 'pending':
            return bookings.filter(b => b.bookingStatus === BookingStatus.PENDING_CONFIRMATION);
        default:
            return [];
    }
  };
  
  const filteredBookings = getFilteredBookings();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">My Bookings</h1>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
               <button onClick={() => setActiveTab('pending')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Pending ({bookings.filter(b => b.bookingStatus === BookingStatus.PENDING_CONFIRMATION).length})
              </button>
              <button onClick={() => setActiveTab('upcoming')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Upcoming
              </button>
               <button onClick={() => setActiveTab('ongoing')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ongoing' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Ongoing
              </button>
              <button onClick={() => setActiveTab('past')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Past
              </button>
          </nav>
      </div>

      {loading ? (
        <div className="flex justify-center mt-8"><Spinner /></div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map(booking => (
            <BookingCard key={booking.bookingId} booking={booking} userRole="host" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">No {activeTab} bookings</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You don't have any bookings in this category.</p>
        </div>
      )}
    </div>
  );
};

export default HostBookingsPage;