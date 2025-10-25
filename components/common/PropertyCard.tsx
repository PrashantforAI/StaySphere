import React from 'react';
import { Link } from 'react-router-dom';
import { dummyProperties } from '../../data/dummyData';
import { ROUTES } from '../../constants';

// Get the type of a single property from the dummy data array
type PropertyType = typeof dummyProperties[0];

interface PropertyCardProps {
  property: PropertyType
}

const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>;

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const propertyDetailUrl = ROUTES.PROPERTY_DETAIL.replace(':propertyId', property.propertyId);

  return (
    <Link to={propertyDetailUrl} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img className="w-full h-48 object-cover" src={property.images[0].url} alt={property.title} />
      <div className="p-4">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">{property.title}</h3>
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <StarIcon />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{property.ratings.average.toFixed(1)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({property.ratings.count})</span>
            </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{property.location.city}, {property.location.state}</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          ₹{property.pricing.basePrice.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ night</span>
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;