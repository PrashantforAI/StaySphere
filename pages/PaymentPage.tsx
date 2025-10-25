import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ROUTES } from '../constants';
import { getBookingById, updateBookingStatus } from '../services/firestoreService';
import { Booking, BookingStatus, PaymentStatus } from '../types';
import Spinner from '../components/ui/Spinner';

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleSimulatePayment = async () => {
    if (!bookingId) return;
    setProcessing(true);
    try {
        // In a real app, this would be where you call the Razorpay API.
        // After a successful payment response from Razorpay, you would update your Firestore.
        
        // 1. Update Booking Status to Confirmed
        await updateBookingStatus(bookingId, BookingStatus.CONFIRMED);

        // 2. Update Payment Status in the booking document (this would be a more complex function)
        // For simplicity, we are just updating the main status for now.
        // A real function would update the nested payment object:
        // await db.collection('bookings').doc(bookingId).update({ 'payment.status': PaymentStatus.PAID, ... });
        
        // For now, we just redirect.
        alert('Payment successful! Your booking is confirmed.');
        navigate(ROUTES.BOOKING_DETAIL.replace(':bookingId', bookingId));

    } catch (err) {
        setError('Payment simulation failed. Please try again.');
        console.error(err);
    } finally {
        setProcessing(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto flex flex-col justify-center items-center text-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
            {error || !booking ? (
                 <h1 className="text-2xl font-bold text-red-500">{error || 'Could not load booking.'}</h1>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Complete Your Payment
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        You are booking "{booking.propertyTitle}"
                    </p>

                    <div className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        <div className="flex justify-between font-bold text-xl">
                            <span>Total Amount:</span>
                            <span>₹{booking.pricing.total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    
                    {/* Razorpay integration would go here */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        This is a placeholder for the payment process. In a real application, the Razorpay payment gateway would be integrated here.
                    </p>

                    <button
                        onClick={handleSimulatePayment}
                        disabled={processing}
                        className="w-full px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Simulate Successful Payment'}
                    </button>
                </>
            )}
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
