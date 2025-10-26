import React from 'react';
import { Link } from 'react-router-dom';
import { Property, PropertySearchFilters } from '../../types';
import { ROUTES } from '../../constants';

interface ChatPropertyCardProps {
  property: Property;
  filters?: PropertySearchFilters;
}

const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>;

const ChatPropertyCard: React.FC<ChatPropertyCardProps> = ({ property, filters }) => {
  const baseUrl = ROUTES.PROPERTY_DETAIL.replace(':propertyId', property.propertyId);
  
  // Build query string from inferred filters to pre-fill booking widget
  const buildQueryString = () => {
      if (!filters) return '';
      const params = new URLSearchParams();
      if (filters.checkIn) params.append('checkIn', filters.checkIn);
      if (filters.checkOut) params.append('checkOut', filters.checkOut);
      if (filters.guests?.adults) params.append('adults', String(filters.guests.adults));
      if (filters.guests?.kids) params.append('children', String(filters.guests.kids));
      const queryString = params.toString();
      return queryString ? `?${queryString}` : '';
  };
  
  const propertyDetailUrl = `${baseUrl}${buildQueryString()}`;

  return (
    <Link 
      to={propertyDetailUrl} 
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-48 flex-shrink-0 snap-start transform hover:-translate-y-1 transition-transform duration-300"
    >
      <img className="w-full h-24 object-cover" src={property.images[0].url} alt={property.title} />
      <div className="p-2">
        <h3 className="font-bold text-xs text-gray-900 dark:text-white mb-1 truncate">{property.title}</h3>
        <div className="flex items-center space-x-1">
            <StarIcon />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{property.ratings.average.toFixed(1)}</span>
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
          ₹{property.pricing.basePrice.toLocaleString('en-IN')}
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/n</span>
        </p>
      </div>
    </Link>
  );
};

export default ChatPropertyCard;