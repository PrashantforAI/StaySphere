
import React from 'react';
import { Link } from 'react-router-dom';
import { Property, PropertyStatus } from '../../types';
import { ROUTES } from '../../constants';

interface HostPropertyCardProps {
  property: Property;
}

const getStatusChipColor = (status: PropertyStatus) => {
  switch (status) {
    case PropertyStatus.ACTIVE:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case PropertyStatus.DRAFT:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case PropertyStatus.INACTIVE:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const HostPropertyCard: React.FC<HostPropertyCardProps> = ({ property }) => {
  const editUrl = ROUTES.HOST_EDIT_PROPERTY.replace(':propertyId', property.propertyId);
  const viewUrl = ROUTES.PROPERTY_DETAIL.replace(':propertyId', property.propertyId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative">
        <img className="w-full h-40 object-cover" src={property.images[0]?.url || 'https://placehold.co/600x400/e2e8f0/e2e8f0'} alt={property.title} />
        <span className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusChipColor(property.status)}`}>
          {property.status}
        </span>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{property.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{property.location.city}, {property.location.state}</p>
        
        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center justify-between gap-2 text-sm">
             <Link to={viewUrl} className="font-medium text-primary-600 hover:underline">View Listing</Link>
             <div className="flex items-center gap-2">
                <Link to={editUrl} className="font-medium text-gray-600 dark:text-gray-300 hover:underline">Edit</Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to={ROUTES.HOST_CALENDAR} className="font-medium text-gray-600 dark:text-gray-300 hover:underline">Calendar</Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostPropertyCard;
