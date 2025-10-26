import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceBooking, ServiceBookingStatus } from '../../types';
import { ROUTES } from '../../constants';

interface ServiceBookingCardProps {
  booking: ServiceBooking;
  userType: 'host' | 'provider';
}

const ServiceBookingCard: React.FC<ServiceBookingCardProps> = ({ booking, userType }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusChipColor = (status: ServiceBookingStatus) => {
    switch (status) {
        case ServiceBookingStatus.ACCEPTED:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case ServiceBookingStatus.COMPLETED:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case ServiceBookingStatus.REQUESTED:
        case ServiceBookingStatus.APPLIED:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case ServiceBookingStatus.CANCELLED:
             return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate capitalize">{booking.serviceType.replace('_', ' ')} Service</h3>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusChipColor(booking.status)}`}>
                {booking.status.replace('_', ' ').toLowerCase()}
            </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            For: <Link to={ROUTES.PROPERTY_DETAIL.replace(':propertyId', booking.propertyId)} className="font-semibold text-primary-600 hover:underline">{booking.propertyTitle}</Link>
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            Requested Date: {formatDate(booking.requestedDate)}
        </p>
        
        {userType === 'host' && booking.applicants.length > 0 && (
             <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{booking.applicants.length} applicant(s)</p>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <p className="text-md font-semibold text-gray-800 dark:text-gray-200">
                {booking.cost ? `Final Cost: ₹${booking.cost.toLocaleString('en-IN')}` : 'Awaiting Quote'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingCard;
