import React from 'react';
import { Link } from 'react-router-dom';
import { Booking, BookingStatus, UserRole } from '../../types';
import { ROUTES } from '../../constants';

interface BookingCardProps {
  booking: Booking;
  userRole: 'guest' | 'host';
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, userRole }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusChipColor = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.CONFIRMED:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case BookingStatus.COMPLETED:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case BookingStatus.ONGOING:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case BookingStatus.PENDING_CONFIRMATION:
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case BookingStatus.CANCELLED_BY_GUEST:
        case BookingStatus.CANCELLED_BY_HOST:
             return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Link 
        to={ROUTES.BOOKING_DETAIL.replace(':bookingId', booking.bookingId)}
        className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
    >
      <img className="w-full h-40 object-cover" src={booking.propertyImage} alt={booking.propertyTitle} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{booking.propertyTitle}</h3>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusChipColor(booking.bookingStatus)}`}>
                {booking.bookingStatus.replace('_', ' ').toLowerCase()}
            </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
        </p>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <p className="text-md font-semibold text-gray-800 dark:text-gray-200">
                Total {userRole === 'guest' ? 'Price' : 'Payout'}: ₹{booking.pricing.total.toLocaleString('en-IN')}
            </p>
        </div>
      </div>
    </Link>
  );
};

export default BookingCard;
