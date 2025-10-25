import React, { useState, useEffect } from 'react';
import LeftPanel from '../components/layout/LeftPanel';
import CenterPanel from '../components/layout/CenterPanel';
import RightPanel from '../components/layout/RightPanel';
import MobileNav, { MobileView } from '../components/layout/MobileNav';
import ChatInterface from '../components/chat/ChatInterface';
import { PropertySearchFilters } from '../types';
import { dummyProperties, dummyBookings } from '../data/dummyData';

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

export type SortOrder = 'default' | 'price_asc' | 'price_desc';

const DashboardPage: React.FC = () => {
  // State to manage which view is shown on mobile
  const [mobileView, setMobileView] = useState<MobileView>('main');
  // State to control the visibility of the full-screen chat modal on mobile
  const [isChatOpen, setIsChatOpen] = useState(false);

  // States for property search and display
  const [allProperties] = useState(dummyProperties);
  const [filteredProperties, setFilteredProperties] = useState(dummyProperties);
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [searchMode, setSearchMode] = useState<'manual' | 'ai'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  // Effect to apply filters and sorting whenever they change
  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay for a better UX
    const debounceTimer = setTimeout(() => {
        let properties = [...allProperties];

        // Location filter (case-insensitive partial match)
        if (filters.location) {
            properties = properties.filter(p => p.location.city.toLowerCase().includes(filters.location!.toLowerCase()));
        }

        // Guests filter
        if (filters.guests) {
            const totalGuests = (filters.guests.adults || 0) + (filters.guests.kids || 0);
            if(totalGuests > 0) {
               properties = properties.filter(p => p.capacity.maxGuests >= totalGuests);
            }
        }
        
        // Price filter
        if (filters.priceMin) {
            properties = properties.filter(p => p.pricing.basePrice >= filters.priceMin!);
        }
        if (filters.priceMax) {
            properties = properties.filter(p => p.pricing.basePrice <= filters.priceMax!);
        }

        // Rules filters
        if (filters.isPetFriendly) {
            properties = properties.filter(p => p.rules.petFriendly);
        }
        if (filters.isVegAllowed) {
            properties = properties.filter(p => p.rules.vegAllowed);
        }
        if (filters.isNonVegAllowed) {
            properties = properties.filter(p => p.rules.nonVegAllowed);
        }

        // Amenities filter (checks if all requested amenities are present)
        if (filters.amenities && filters.amenities.length > 0) {
            properties = properties.filter(p =>
                filters.amenities!.every(amenity =>
                    p.amenities.some(propAmenity => propAmenity.toLowerCase().includes(amenity.toLowerCase()))
                )
            );
        }
        
        // Sorting logic
        if (sortOrder === 'price_asc') {
            properties.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
        } else if (sortOrder === 'price_desc') {
            properties.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);
        }
        
        setFilteredProperties(properties);
        setIsLoading(false);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters, allProperties, sortOrder]);

  const handleManualSearch = (newFilters: PropertySearchFilters) => {
    setSearchMode('manual');
    setFilters(newFilters);
  };

  const handleAiSearch = (aiFilters: PropertySearchFilters) => {
    setSearchMode('ai');
    // Merge AI filters with existing ones for a more interactive experience
    setFilters(prev => ({...prev, ...aiFilters}));
     if (isChatOpen) {
      setIsChatOpen(false); // Close chat modal on mobile after AI search
    }
  };
  
  const handleModeToggle = () => {
    if (searchMode === 'ai') {
        setSearchMode('manual');
        setFilters({}); // Reset filters when switching to manual
    } else {
        setSearchMode('ai');
        setFilters({}); // Clear manual filters to let AI take over
        // On mobile, also open the chat modal so the user can talk to the AI
        if (window.innerWidth < 768) {
            setIsChatOpen(true);
        }
    }
  };

  // A simple router for mobile view content
  const renderMobileContent = () => {
    switch (mobileView) {
      case 'main':
        return <RightPanel 
            properties={filteredProperties}
            onManualSearch={handleManualSearch}
            searchMode={searchMode}
            isLoading={isLoading}
            onModeToggle={handleModeToggle}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
        />;
      case 'profile':
        // On mobile, the LeftPanel can serve as the profile view
        return <LeftPanel />;
      default:
        return <RightPanel 
            properties={filteredProperties}
            onManualSearch={handleManualSearch}
            searchMode={searchMode}
            isLoading={isLoading}
            onModeToggle={handleModeToggle}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
        />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* ====================================================================== */}
      {/* Desktop Layout: 3-panel grid. Hidden on screens smaller than 'md'.   */}
      {/* ====================================================================== */}
      <div className="hidden md:grid md:grid-cols-10 h-full">
        <div className="md:col-span-2">
          <LeftPanel />
        </div>
        <div className="md:col-span-4">
          <CenterPanel onAiSearch={handleAiSearch} />
        </div>
        <div className="md:col-span-4">
          <RightPanel
            properties={filteredProperties}
            onManualSearch={handleManualSearch}
            searchMode={searchMode}
            isLoading={isLoading}
            onModeToggle={handleModeToggle}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </div>
      </div>

      {/* ====================================================================== */}
      {/* Mobile Layout: Single panel with bottom nav. Visible only on mobile. */}
      {/* ====================================================================== */}
      <div className="md:hidden h-full flex flex-col">
        <div className="flex-grow overflow-y-auto pb-16 text-gray-900 dark:text-gray-100">
          {renderMobileContent()}
        </div>
        
        {/* Bottom navigation bar */}
        <MobileNav activeView={mobileView} onNavigate={setMobileView} onChatClick={() => setIsChatOpen(true)} />

        {/* Chat Modal for Mobile */}
        {isChatOpen && (
            <div className="md:hidden fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 flex flex-col animate-slide-in-up">
                <div className="flex-grow overflow-hidden">
                     {/* The ChatInterface header is disabled here, as the modal provides its own */}
                     <ChatInterface onAiSearch={handleAiSearch} showHeader={false} />
                </div>
                 {/* Custom footer with close button for the modal */}
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                   <button 
                        onClick={() => setIsChatOpen(false)}
                        className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <CloseIcon />
                        <span className="ml-2 font-semibold">Close Chat</span>
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;