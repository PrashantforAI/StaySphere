
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getHostProperties } from '../../services/firestoreService';
import { Property, PropertyStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import Header from '../../components/layout/Header';
import { ROUTES } from '../../constants';
import HostPropertyCard from '../../components/host/HostPropertyCard';

const PlusIcon = () => <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;

const HostPropertiesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<PropertyStatus | 'all'>('all');

  useEffect(() => {
    const fetchProperties = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const hostProperties = await getHostProperties(currentUser.uid);
        setProperties(hostProperties);
      } catch (err) {
        setError('Failed to load your properties. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [currentUser]);

  const filteredProperties = properties.filter(p => filter === 'all' || p.status === filter);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">My Properties</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your listings, calendars, and earnings.</p>
            </div>
            <Link
                to={ROUTES.HOST_ADD_PROPERTY}
                className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300"
            >
                <PlusIcon />
                Add New Property
            </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                {/* FIX: Replaced string literals with PropertyStatus enum members to satisfy TypeScript's type checker. */}
                {(['all', PropertyStatus.ACTIVE, PropertyStatus.DRAFT, PropertyStatus.INACTIVE] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`capitalize py-2 px-4 text-sm font-medium ${
                        filter === status
                            ? 'border-b-2 border-primary-500 text-primary-600'
                            : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-12"><Spinner /></div>
        ) : error ? (
          <p className="text-red-500 text-center mt-12">{error}</p>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(prop => (
              <HostPropertyCard key={prop.propertyId} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No properties found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                {filter === 'all' ? "Click 'Add New Property' to get started." : `You have no ${filter} properties.`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HostPropertiesPage;
