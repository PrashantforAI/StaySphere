import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import PropertyCard from '../common/PropertyCard';
import SearchBar from '../search/SearchBar';
import { PropertySearchFilters } from '../../types';
import Spinner from '../ui/Spinner';
import { dummyProperties as DummyPropertyType } from '../../data/dummyData';
import MapView from '../map/MapView';
import { SortOrder } from '../../pages/DashboardPage';

interface RightPanelProps {
  properties: typeof DummyPropertyType;
  onManualSearch: (filters: PropertySearchFilters) => void;
  searchMode: 'manual' | 'ai';
  isLoading: boolean;
  onModeToggle: () => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ properties, onManualSearch, searchMode, isLoading, onModeToggle, sortOrder, onSortChange }) => {
  const { userProfile } = useAuth();
  
  return (
    <div className="h-full bg-gray-100 dark:bg-black p-4 md:p-8 overflow-y-auto">
      <div className="text-gray-900 dark:text-gray-100 max-w-7xl mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
                Find your perfect stay, {userProfile?.displayName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
                Search manually or ask our AI assistant for recommendations.
            </p>
        </div>

        <SearchBar onSearch={onManualSearch} isAiMode={searchMode === 'ai'} />
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className='flex items-center'>
                 <h2 className="text-xl font-bold">
                    {searchMode === 'ai' ? 'AI Recommendations' : 'Search Results'}
                 </h2>
                 <span className="ml-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">{properties.length}</span>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <select
                    id="sort-by"
                    value={sortOrder}
                    onChange={(e) => onSortChange(e.target.value as SortOrder)}
                    className="block w-full sm:w-auto pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                >
                    <option value="default">Sort by relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
                <button
                    onClick={onModeToggle}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex-shrink-0"
                >
                    {searchMode === 'ai' ? 'Manual Search' : 'Ask AI Instead'}
                </button>
            </div>
        </div>
        
        <MapView properties={properties} />

        {isLoading ? <div className="flex justify-center mt-8"><Spinner /></div> : (
             properties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-6">
                {properties.map((prop, index) => (
                    <PropertyCard key={index} property={prop} />
                ))}
                </div>
             ) : (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">No properties found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search filters or asking the AI assistant for help.</p>
                </div>
             )
        )}
      </div>
    </div>
  );
};

export default RightPanel;