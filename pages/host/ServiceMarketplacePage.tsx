import React, { useState, useEffect } from 'react';
import { getServiceProviders } from '../../services/firestoreService';
import { ServiceProviderProfile, ServiceSpecialty } from '../../types';
import Spinner from '../../components/ui/Spinner';
import ServiceProviderCard from '../../components/service_provider/ServiceProviderCard';

const specialties: ServiceSpecialty[] = ['cleaning', 'plumbing', 'electrical', 'photography', 'catering', 'pest_control'];

const ServiceMarketplacePage: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{ specialty?: ServiceSpecialty, location?: string }>({});

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const providerData = await getServiceProviders(filters);
        setProviders(providerData);
      } catch (err) {
        console.error("Failed to load service providers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [filters]);

  return (
    <div className="p-4 md:p-8">
      <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Service Provider Marketplace</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find trusted professionals to help with your property.</p>
      </div>

      {/* Filters */}
      <div className="my-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/3">
               <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialty</label>
               <select 
                  id="specialty-filter"
                  value={filters.specialty || ''}
                  onChange={e => setFilters(f => ({ ...f, specialty: e.target.value as ServiceSpecialty }))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                  <option value="">All Services</option>
                  {specialties.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
               </select>
          </div>
           <div className="w-full md:w-1/3">
               <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
               <input 
                  type="text"
                  id="location-filter"
                  placeholder="e.g., Mumbai"
                  value={filters.location || ''}
                  onChange={e => setFilters(f => ({...f, location: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
               />
          </div>
          <div className="w-full md:w-auto mt-2 md:mt-6">
               <button onClick={() => setFilters({})} className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  Clear Filters
               </button>
          </div>
      </div>

      {loading ? (
          <div className="flex justify-center mt-12"><Spinner /></div>
      ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map(provider => (
                  <ServiceProviderCard key={provider.providerId} provider={provider} />
              ))}
          </div>
      ) : (
          <div className="text-center py-16">
              <h3 className="text-xl font-semibold">No providers found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
          </div>
      )}

    </div>
  );
};

export default ServiceMarketplacePage;