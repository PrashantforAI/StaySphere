import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import PropertyCard from '../common/PropertyCard';

// Dummy data for properties to simulate a real listing page.
// In a real application, this data would be fetched from Firestore.
const dummyProperties = [
  {
    title: 'Serene Beachfront Villa',
    location: 'Goa, India',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 120,
  },
  {
    title: 'Cozy Mountain Cottage',
    location: 'Manali, Himachal Pradesh',
    price: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 95,
  },
  {
    title: 'Modern City Apartment',
    location: 'Mumbai, Maharashtra',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 210,
  },
  {
    title: 'Luxury Lakeside Retreat',
    location: 'Udaipur, Rajasthan',
    price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 150,
  },
];


const RightPanel: React.FC = () => {
  const { userProfile } = useAuth();
  
  return (
    <div className="h-full bg-gray-100 dark:bg-black p-4 md:p-8 overflow-y-auto">
      <div className="text-gray-900 dark:text-gray-100 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Hello, {userProfile?.displayName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome back. Here are some featured properties you might like.
        </p>

        {/* Grid for displaying property cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {dummyProperties.map((prop, index) => (
            <PropertyCard key={index} property={prop} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
