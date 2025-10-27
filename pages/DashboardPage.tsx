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
import GuestProfilePage from './guest/GuestProfilePage';
import Spinner from '../components/ui/Spinner';

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

export type SortOrder = 'default' | 'price_asc' | 'price_desc';

const DashboardPage: React.FC = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
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

  // Effect to redirect non-guest users to their respective dashboards
  useEffect(() => {
    if (!authLoading && userProfile) {
        switch (userProfile.role) {
            case UserRole.HOST:
                navigate(ROUTES.HOST_DASHBOARD, { replace: true });
                break;
            case UserRole.ADMIN:
                navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
                break;
            case UserRole.SERVICE_PROVIDER:
                navigate(ROUTES.PROVIDER_DASHBOARD, { replace: true });
                break;
            case UserRole.GUEST:
                // Guests stay here, no action needed.
                break;
        }
    }
  }, [userProfile, authLoading, navigate]);


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

  if (authLoading || (userProfile && userProfile.role !== UserRole.GUEST)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // ======================================================================
  // GUEST-SPECIFIC RENDER
  // ======================================================================
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
};

export default DashboardPage;