import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import PropertyCard from '../common/PropertyCard';
import SearchBar from '../search/SearchBar';
import { PropertySearchFilters } from '../../types';
import Spinner from '../ui/Spinner';
import { dummyProperties as DummyPropertyType } from '../../data/dummyData';

interface RightPanelProps {
  properties: typeof DummyPropertyType;
  onManualSearch: (filters: PropertySearchFilters) => void;
  searchMode: 'manual' | 'ai';
  isLoading: boolean;
  onModeToggle: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ properties, onManualSearch, searchMode, isLoading, onModeToggle }) => {
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
        
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
                {searchMode === 'ai' ? 'AI Recommendations' : 'Search Results'}
            </h2>
             <button
                onClick={onModeToggle}
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
                {searchMode === 'ai' ? 'Switch to Manual Search' : 'Ask AI Instead'}
            </button>
        </div>

        {/* Placeholder for Map View */}
        <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-gray-500">Map View Placeholder</p>
        </div>

        {isLoading ? <div className="flex justify-center mt-8"><Spinner /></div> : (
             properties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
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