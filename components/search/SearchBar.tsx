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
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('1');
  const [kids, setKids] = useState('0');
  const [infants, setInfants] = useState('0');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location: location || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests: {
        adults: parseInt(adults, 10) || 0,
        kids: parseInt(kids, 10) || 0,
        infants: parseInt(infants, 10) || 0,
      }
    });
  };
  
  const commonInputClasses = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-gray-700";

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 relative">
       {isAiMode && <div className="absolute inset-0 bg-gray-400/30 dark:bg-gray-900/50 rounded-lg z-10 cursor-not-allowed"></div>}
      <form onSubmit={handleSearch} >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-3">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Lonavala"
              className={commonInputClasses}
              disabled={isAiMode}
            />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-in</label>
            <input
              type="date"
              id="checkin"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className={commonInputClasses}
              disabled={isAiMode}
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
            />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-out</label>
            <input
              type="date"
              id="checkout"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className={commonInputClasses}
              disabled={isAiMode}
              min={checkIn || new Date().toISOString().split("T")[0]} // Prevent dates before check-in
            />
          </div>
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Guests</label>
             <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <label htmlFor="adults" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Adults (18+)</label>
                  <input type="number" id="adults" value={adults} onChange={e => setAdults(e.target.value)} className={commonInputClasses} min="1" disabled={isAiMode} />
                </div>
                 <div>
                  <label htmlFor="kids" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Kids (5-12)</label>
                  <input type="number" id="kids" value={kids} onChange={e => setKids(e.target.value)} className={commonInputClasses} min="0" disabled={isAiMode} />
                </div>
                 <div>
                  <label htmlFor="infants" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Infants (&lt;5)</label>
                  <input type="number" id="infants" value={infants} onChange={e => setInfants(e.target.value)} className={commonInputClasses} min="0" disabled={isAiMode} />
                </div>
             </div>
          </div>
           <div className="lg:col-span-2 lg:self-end mt-4 lg:mt-0">
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition duration-300 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={isAiMode}
              >
                <SearchIcon />
                Search
              </button>
           </div>
        </div>
      </form>
       {isAiMode && <p className="text-xs text-center mt-2 text-primary-600 dark:text-primary-400 font-semibold">AI is controlling the search. Chat to refine results.</p>}
    </div>
  );
};

export default SearchBar;