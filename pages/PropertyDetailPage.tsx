import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../services/firestoreService';
import { Property, UserRole } from '../types';
import Spinner from '../components/ui/Spinner';
import Header from '../components/layout/Header';
import { ROUTES } from '../constants';
import ImageCarousel from '../components/property/ImageCarousel';
import AmenitiesGrid from '../components/property/AmenitiesGrid';
import ReviewsSection from '../components/property/ReviewsSection';
import HostInfoCard from '../components/property/HostInfoCard';
import BookingWidget from '../components/booking/BookingWidget';
import { useAuth } from '../hooks/useAuth';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;

const PropertyDetailPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { userProfile } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError('Property ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const propData = await getPropertyById(propertyId);
        if (propData) {
          setProperty(propData);
        } else {
          setError('Property not found.');
        }
      } catch (err) {
        setError('Failed to fetch property details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-4 text-center">
          <h2 className="text-2xl font-bold text-red-500">{error}</h2>
          <Link to={ROUTES.DASHBOARD} className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  if (!property) return null;

  // Using OpenStreetMap to avoid Google Maps API key issues.
  const { lat, lng } = property.location.coordinates;
  const bboxPadding = 0.008; // This value controls the zoom level.
  const bbox = `${lng - bboxPadding},${lat - bboxPadding},${lng + bboxPadding},${lat + bboxPadding}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-4">
            <Link to={ROUTES.DASHBOARD} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <ArrowLeftIcon />
                <span className="ml-2">Back to Search</span>
            </Link>
        </div>

        {/* Property Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
          <p className="text-md text-gray-500 dark:text-gray-400 mt-1">{property.location.city}, {property.location.state}</p>
        </div>
        
        {/* Image Gallery */}
        <ImageCarousel images={property.images} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-8">
            {/* Left Column (Details) */}
            <div className="lg:col-span-2">
                <div className="prose dark:prose-invert max-w-none">
                    <p>{property.description}</p>
                </div>
                
                <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>

                <AmenitiesGrid amenities={property.amenities} />
                
                <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>

                <HostInfoCard host={property.host} />

            </div>
            {/* Right Column (Booking Widget) */}
            <aside className="lg:col-span-1">
                {userProfile?.role === UserRole.GUEST ? (
                    <BookingWidget property={property} />
                ) : (
                    <div className="sticky top-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-lg">Booking Information</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            As a host, you can view property details but cannot book your own property. Log in as a guest to make a reservation.
                        </p>
                    </div>
                )}
            </aside>
        </div>

        {/* Reviews and Map */}
         <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ReviewsSection reviews={property.reviews} averageRating={property.ratings.average} />
            
            {/* OpenStreetMap Embed */}
            <div>
                 <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Location</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-3">
                    Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">OpenStreetMap</a> contributors.
                 </p>
                 <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                    <iframe 
                        src={osmEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Property Location on OpenStreetMap"
                    ></iframe>
                 </div>
            </div>
         </div>

      </main>
    </div>
  );
};

export default PropertyDetailPage;