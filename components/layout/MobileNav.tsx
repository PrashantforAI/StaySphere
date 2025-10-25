import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

// Define the possible views for mobile navigation
export type MobileView = 'main' | 'profile';

interface MobileNavProps {
    activeView: MobileView;
    onNavigate: (view: MobileView) => void;
    onChatClick: () => void;
}

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.134c0-2.639 2.11-4.75 4.75-4.75h4.134c2.64 0 4.75 2.111 4.75 4.75Z" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const TripsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48-.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0ZM4.5 21.75v-5.172c0-.334.148-.65.405-.864l1.068-.89c.442-.369.535-1.01.216-1.49l-.51-.766a2.25 2.25 0 0 1-1.161-.886l-.143-.048a1.107 1.107 0 0 0-1.57 1.098l-.218.104a1.107 1.107 0 0 0-.57 1.664c.352.622.242 1.38-.216 1.92l-.51.766c-.32.48-.414 1.121-.216 1.49l1.068.89c.257.214.405.53.405.864v5.172a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1 0-4.5h.75a2.25 2.25 0 0 1 2.25 2.25v3.375Z" /></svg>;


const MobileNav: React.FC<MobileNavProps> = ({ activeView, onNavigate, onChatClick }) => {
  const { userProfile } = useAuth();
  
  const getButtonClass = (view: MobileView) => {
    const baseClasses = 'flex flex-col items-center justify-center flex-1 py-2 transition-colors duration-200';
    const activeClasses = 'text-primary-600 dark:text-primary-400';
    const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400';
    return `${baseClasses} ${activeView === view ? activeClasses : inactiveClasses}`;
  }
  
  const baseLinkClass = 'flex flex-col items-center justify-center flex-1 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200';
  const baseButtonClass = 'flex flex-col items-center justify-center flex-1 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200';

  const tripsLink = userProfile?.role === UserRole.HOST ? ROUTES.HOST_BOOKINGS : ROUTES.MY_TRIPS;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-10">
      <div className="flex justify-around items-center h-16">
        <button className={getButtonClass('main')} onClick={() => onNavigate('main')}>
          <HomeIcon />
          <span className="text-xs font-medium">Explore</span>
        </button>
        <Link to={tripsLink} className={baseLinkClass}>
          <TripsIcon />
          <span className="text-xs font-medium">Trips</span>
        </Link>
        <button className={baseButtonClass} onClick={onChatClick}>
          <ChatIcon />
          <span className="text-xs font-medium">AI Chat</span>
        </button>
        <button className={getButtonClass('profile')} onClick={() => onNavigate('profile')}>
          <ProfileIcon />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;