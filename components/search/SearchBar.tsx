import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { PropertySearchFilters } from '../../types';

interface SearchBarProps {
  onSearch: (filters: PropertySearchFilters) => void;
  isAiMode: boolean;
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isAiMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Main filters
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('1');
  const [kids, setKids] = useState('0');
  const [infants, setInfants] = useState('0');

  // Advanced filters
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isPetFriendly, setIsPetFriendly] = useState(false);
  const [isVegAllowed, setIsVegAllowed] = useState(false);
  const [isNonVegAllowed, setIsNonVegAllowed] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const activeFilterCount = [
    priceMin, priceMax, isPetFriendly, isVegAllowed, isNonVegAllowed
  ].filter(Boolean).length + amenities.length;


  const handleAmenityChange = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const clearAdvancedFilters = () => {
      setPriceMin('');
      setPriceMax('');
      setAmenities([]);
      setIsPetFriendly(false);
      setIsVegAllowed(false);
      setIsNonVegAllowed(false);
  };

  const submitSearch = () => {
    onSearch({
      location: location || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests: {
        adults: parseInt(adults, 10) || 0,
        kids: parseInt(kids, 10) || 0,
        infants: parseInt(infants, 10) || 0,
      },
      priceMin: parseInt(priceMin, 10) || undefined,
      priceMax: parseInt(priceMax, 10) || undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
      isPetFriendly: isPetFriendly || undefined,
      isVegAllowed: isVegAllowed || undefined,
      isNonVegAllowed: isNonVegAllowed || undefined,
    });
  };

  const handleMainSearch = (e: FormEvent) => {
      e.preventDefault();
      submitSearch();
  };
  
  const handleApplyFilters = () => {
      submitSearch();
      setIsModalOpen(false);
  };
  
  const commonInputClasses = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-gray-700/50";

  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 relative">
        {isAiMode && <div className="absolute inset-0 bg-gray-400/30 dark:bg-gray-900/50 rounded-lg z-10 cursor-not-allowed"></div>}
        <form onSubmit={handleMainSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {/* Location */}
          <div className="sm:col-span-2 md:col-span-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Lonavala" className={commonInputClasses} disabled={isAiMode} />
          </div>
          {/* Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-in</label>
              <input type="date" id="checkin" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={commonInputClasses} disabled={isAiMode} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-out</label>
              <input type="date" id="checkout" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={commonInputClasses} disabled={isAiMode} min={checkIn || new Date().toISOString().split("T")[0]} />
            </div>
          </div>
          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Guests</label>
             <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <label htmlFor="adults" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Adults</label>
                  <input type="number" id="adults" value={adults} onChange={e => setAdults(e.target.value)} className={commonInputClasses} min="1" disabled={isAiMode} />
                </div>
                 <div>
                  <label htmlFor="kids" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Kids</label>
                  <input type="number" id="kids" value={kids} onChange={e => setKids(e.target.value)} className={commonInputClasses} min="0" disabled={isAiMode} />
                </div>
                 <div>
                  <label htmlFor="infants" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Infants</label>
                  <input type="number" id="infants" value={infants} onChange={e => setInfants(e.target.value)} className={commonInputClasses} min="0" disabled={isAiMode} />
                </div>
             </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full">
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={isAiMode}
                className="flex-shrink-0 relative w-auto flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300 disabled:opacity-50"
            >
                <FilterIcon />
                {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                        {activeFilterCount}
                    </span>
                )}
            </button>
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-300 disabled:bg-gray-500 dark:disabled:bg-gray-600"
              disabled={isAiMode}
            >
              <SearchIcon />
              Search
            </button>
          </div>
        </form>
        {isAiMode && <p className="text-xs text-center mt-3 text-primary-600 dark:text-primary-400 font-semibold">AI is controlling the search. Chat to refine results.</p>}
      </div>
      
      {/* Advanced Filters Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-up">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <CloseIcon />
                </button>
              </div>
              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto">
                 {/* Price Range */}
                <div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Price Range (/night)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="priceMin" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Min price</label>
                            <input type="number" id="priceMin" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="₹0" className={commonInputClasses} min="0" />
                        </div>
                        <div>
                            <label htmlFor="priceMax" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Max price</label>
                            <input type="number" id="priceMax" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="₹50000+" className={commonInputClasses} min="0" />
                        </div>
                    </div>
                </div>
                 {/* Amenities */}
                 <div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {['Pool', 'Wifi', 'AC', 'Parking', 'Kitchen', 'Gym'].map(amenity => (
                             <label key={amenity} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 focus:ring-primary-500" checked={amenities.includes(amenity.toLowerCase())} onChange={() => handleAmenityChange(amenity.toLowerCase())} />
                                <span className="ml-2">{amenity}</span>
                             </label>
                        ))}
                    </div>
                 </div>
                 {/* Rules */}
                 <div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Rules</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 focus:ring-primary-500" checked={isPetFriendly} onChange={e => setIsPetFriendly(e.target.checked)} />
                            <span className="ml-2">Pet Friendly</span>
                        </label>
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 focus:ring-primary-500" checked={isVegAllowed} onChange={e => setIsVegAllowed(e.target.checked)} />
                            <span className="ml-2">Veg Allowed</span>
                        </label>
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 focus:ring-primary-500" checked={isNonVegAllowed} onChange={e => setIsNonVegAllowed(e.target.checked)} />
                            <span className="ml-2">Non-Veg Allowed</span>
                        </label>
                    </div>
                 </div>
              </div>
              {/* Modal Footer */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={clearAdvancedFilters}
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:underline">
                      Clear all
                  </button>
                  <button 
                    onClick={handleApplyFilters}
                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      Show properties
                  </button>
              </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;