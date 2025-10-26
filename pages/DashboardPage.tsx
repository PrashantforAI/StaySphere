import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftPanel from '../components/layout/LeftPanel';
import CenterPanel from '../components/layout/CenterPanel';
import RightPanel from '../components/layout/RightPanel';
import MobileNav, { MobileView } from '../components/layout/MobileNav';
import ChatInterface from '../components/chat/ChatInterface';
import { PropertySearchFilters, UserRole } from '../types';
import { dummyProperties } from '../data/dummyData';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';
import GuestMobileNav, { GuestMobileView } from '../components/layout/GuestMobileNav';

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

export type SortOrder = 'default' | 'price_asc' | 'price_desc';

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  
  // States for property search and display (used by both layouts)
  const [allProperties] = useState(dummyProperties);
  const [filteredProperties, setFilteredProperties] = useState(dummyProperties);
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [searchMode, setSearchMode] = useState<'manual' | 'ai'>('ai'); // Default to AI for guests
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  
  // Non-guest specific states
  const [mobileView, setMobileView] = useState<MobileView>('main');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Guest-specific states
  const [guestView, setGuestView] = useState<GuestMobileView>('chat');

  // Effect to apply filters and sorting whenever they change
  useEffect(() => {
    setIsLoading(true);
    const debounceTimer = setTimeout(() => {
        let properties = [...allProperties];
        if (Object.keys(filters).length > 0) {
            // Location filter
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
        }
        
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
    setGuestView('explore'); // Switch to explore view on manual search
  };
  
  // This is now handled within ChatInterface, but we can use it to switch views
  const handleAiSearch = (aiFilters: PropertySearchFilters) => {
    setSearchMode('ai');
    setFilters(prev => ({...prev, ...aiFilters}));
    setGuestView('chat'); // Ensure user is on chat view for AI search
  };
  
  const handleModeToggle = () => {
    setSearchMode(prev => prev === 'ai' ? 'manual' : 'ai');
    setFilters({});
  };

  // ======================================================================
  // GUEST-SPECIFIC RENDER
  // ======================================================================
  if (userProfile?.role === UserRole.GUEST) {
    const renderGuestContent = () => {
        switch (guestView) {
            case 'chat':
                return <ChatInterface showHeader={false} />;
            case 'explore':
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
                return <LeftPanel />;
            default:
                return <ChatInterface showHeader={false} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <div className="flex-grow overflow-y-auto">
                {renderGuestContent()}
            </div>
            <GuestMobileNav activeView={guestView} onNavigate={setGuestView} />
        </div>
    );
  }

  // ======================================================================
  // HOST, ADMIN, SP RENDER (Original Layout)
  // ======================================================================
  const renderMobileContent = () => {
    switch (mobileView) {
      case 'main':
        return <RightPanel properties={filteredProperties} onManualSearch={handleManualSearch} searchMode={searchMode} isLoading={isLoading} onModeToggle={handleModeToggle} sortOrder={sortOrder} onSortChange={setSortOrder} />;
      case 'profile':
        return <LeftPanel />;
      default:
        return <RightPanel properties={filteredProperties} onManualSearch={handleManualSearch} searchMode={searchMode} isLoading={isLoading} onModeToggle={handleModeToggle} sortOrder={sortOrder} onSortChange={setSortOrder} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="hidden md:grid md:grid-cols-10 h-full">
        <div className="md:col-span-2"><LeftPanel /></div>
        <div className="md:col-span-4"><CenterPanel onAiSearch={handleAiSearch} /></div>
        <div className="md:col-span-4"><RightPanel properties={filteredProperties} onManualSearch={handleManualSearch} searchMode={searchMode} isLoading={isLoading} onModeToggle={handleModeToggle} sortOrder={sortOrder} onSortChange={setSortOrder} /></div>
      </div>
      <div className="md:hidden h-full flex flex-col">
        <div className="flex-grow overflow-y-auto pb-16 text-gray-900 dark:text-gray-100">{renderMobileContent()}</div>
        <MobileNav activeView={mobileView} onNavigate={setMobileView} onChatClick={() => setIsChatOpen(true)} />
        {isChatOpen && (
            <div className="md:hidden fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 flex flex-col animate-slide-in-up">
                <div className="flex-grow overflow-hidden">
                     <ChatInterface onAiSearch={handleAiSearch} showHeader={false} />
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                   <button onClick={() => setIsChatOpen(false)} className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
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