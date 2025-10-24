import React, { useState, useEffect } from 'react';
import LeftPanel from '../components/layout/LeftPanel';
import CenterPanel from '../components/layout/CenterPanel';
import RightPanel from '../components/layout/RightPanel';
import MobileNav, { MobileView } from '../components/layout/MobileNav';
import ChatInterface from '../components/chat/ChatInterface';
import { PropertySearchFilters } from '../types';
import { dummyProperties } from '../data/dummyData';

const ChatIcon = () => <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.134c0-2.639 2.11-4.75 4.75-4.75h4.134c2.64 0 4.75 2.111 4.75 4.75Z" /></svg>
const CloseIcon = () => <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

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

  // Effect to apply filters whenever they change
  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay for a better UX
    const debounceTimer = setTimeout(() => {
        let properties = allProperties;

        // Location filter (case-insensitive partial match)
        if (filters.location) {
            properties = properties.filter(p => p.location.toLowerCase().includes(filters.location!.toLowerCase()));
        }

        // Guests filter
        if (filters.guests) {
            properties = properties.filter(p => p.guests >= filters.guests!);
        }

        // Amenities filter (checks if all requested amenities are present)
        if (filters.amenities && filters.amenities.length > 0) {
            properties = properties.filter(p =>
                filters.amenities!.every(amenity =>
                    p.amenities.some(propAmenity => propAmenity.toLowerCase().includes(amenity.toLowerCase()))
                )
            );
        }
        
        setFilteredProperties(properties);
        setIsLoading(false);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters, allProperties]);

  const handleManualSearch = (newFilters: PropertySearchFilters) => {
    setSearchMode('manual');
    setFilters(newFilters);
  };

  const handleAiSearch = (aiFilters: PropertySearchFilters) => {
    setSearchMode('ai');
    setFilters(aiFilters);
     if (isChatOpen) {
      setIsChatOpen(false); // Close chat modal on mobile after AI search
    }
  };
  
  const handleModeToggle = () => {
    if (searchMode === 'ai') {
        setSearchMode('manual');
        // Reset filters when switching to manual to avoid confusion
        setFilters({});
    } else {
        // If on mobile, open chat. On desktop, user can just click chat panel.
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
        />;
      case 'inbox':
        // For mobile, we show the full AI chat as the "inbox"
        return <ChatInterface onAiSearch={handleAiSearch} />;
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
        <MobileNav activeView={mobileView} onNavigate={setMobileView} />

        {/* Floating Action Button (FAB) for chat, hidden if inbox is active */}
        {mobileView !== 'inbox' && (
          <button 
            onClick={() => setMobileView('inbox')}
            className="fixed bottom-20 right-4 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 z-20"
            aria-label="Open AI Chat"
          >
              <ChatIcon />
          </button>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;