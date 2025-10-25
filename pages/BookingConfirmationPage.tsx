import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ROUTES } from '../constants';

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;

const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto flex flex-col justify-center items-center text-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg w-full">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                <CheckCircleIcon />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Booking Request Sent!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
                Your request has been sent to the host for confirmation. You will receive a notification once it's confirmed. Your booking is not final until you complete the payment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
            <Link
                to={ROUTES.PAYMENT.replace(':bookingId', bookingId || '')}
                className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition duration-300"
            >
                Proceed to Payment
            </Link>
            <Link
                to={ROUTES.MY_TRIPS}
                className="px-8 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition duration-300"
            >
                View My Trips
            </Link>
            </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmationPage;
