import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingById } from '../services/firestoreService';
import { Booking } from '../types';
import Spinner from '../components/ui/Spinner';
import Header from '../components/layout/Header';
import { ROUTES } from '../constants';

const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('Booking ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const bookingData = await getBookingById(bookingId);
        if (bookingData) {
          setBooking(bookingData);
        } else {
          setError('Booking not found.');
        }
      } catch (err) {
        setError('Failed to fetch booking details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }
  
  if (error || !booking) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-4 text-center">
          <h2 className="text-2xl font-bold text-red-500">{error || 'Booking not found.'}</h2>
          <Link to={ROUTES.DASHBOARD} className="text-primary-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const totalGuests = booking.guests.adults + booking.guests.children;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Booking Details</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-1">
                    <img src={booking.propertyImage} alt={booking.propertyTitle} className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-2 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{booking.propertyTitle}</h2>
                    <p className="text-gray-500 dark:text-gray-400">Booking ID: {booking.bookingId}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Check-in</h3>
                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formatDate(booking.checkIn)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Check-out</h3>
                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formatDate(booking.checkOut)}</p>
                        </div>
                         <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Guests</h3>
                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{totalGuests} Guest{totalGuests > 1 ? 's' : ''}</p>
                        </div>
                         <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">{booking.bookingStatus.replace(/_/g, ' ')}</p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-xl font-bold mb-4">Price details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Base price ({booking.pricing.nights} nights)</span><span>₹{booking.pricing.subtotal.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Cleaning fee</span><span>₹{booking.pricing.cleaningFee.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Service fee</span><span>₹{booking.pricing.platformFee.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">GST</span><span>₹{booking.pricing.gst.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700 mt-2"><span>Total</span><span>₹{booking.pricing.total.toLocaleString('en-IN')}</span></div>
                        </div>
                    </div>
                     <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <button className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">Cancel Booking</button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDetailPage;
