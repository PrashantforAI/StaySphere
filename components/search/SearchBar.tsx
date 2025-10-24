import React, { useState } from 'react';
import { PropertySearchFilters } from '../../types';

interface SearchBarProps {
  onSearch: (filters: PropertySearchFilters) => void;
  isAiMode: boolean;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isAiMode }) => {
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location,
      guests: guests ? parseInt(guests, 10) : undefined,
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 relative">
       {isAiMode && <div className="absolute inset-0 bg-gray-400/30 dark:bg-gray-900/50 rounded-lg z-10"></div>}
      <form onSubmit={handleSearch} >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Lonavala"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-gray-700"
              disabled={isAiMode}
            />
          </div>
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Guests</label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="e.g., 4"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-gray-700"
              min="1"
              disabled={isAiMode}
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition duration-300 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={isAiMode}
          >
            <SearchIcon />
            Search
          </button>
        </div>
      </form>
       {isAiMode && <p className="text-xs text-center mt-2 text-primary-600 dark:text-primary-400 font-semibold">AI is controlling the search. Chat to refine results.</p>}
    </div>
  );
};

export default SearchBar;
