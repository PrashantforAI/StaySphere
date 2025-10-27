import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export type GuestMobileView = 'explore' | 'chat'; // 'profile' is now a separate page

interface GuestMobileNavProps {
    activeView: GuestMobileView;
    onNavigate: (view: GuestMobileView) => void;
}

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.134c0-2.639 2.11-4.75 4.75-4.75h4.134c2.64 0 4.75 2.111 4.75 4.75Z" /></svg>;
const MessagesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76v-2.52a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 10.24v2.52M2.25 12.76v2.52a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 15.28v-2.52M4.5 15.75v.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375v-.75" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;

const GuestMobileNav: React.FC<GuestMobileNavProps> = ({ activeView, onNavigate }) => {
  
  const getButtonClass = (view: GuestMobileView) => {
    const baseClasses = 'flex flex-col items-center justify-center flex-1 py-2 transition-colors duration-200';
    const activeClasses = 'text-primary-600 dark:text-primary-400';
    const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400';
    return `${baseClasses} ${activeView === view ? activeClasses : inactiveClasses}`;
  }
  
  const baseLinkClass = 'flex flex-col items-center justify-center flex-1 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200';

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10 flex-shrink-0">
      <div className="flex justify-around items-center h-16">
        <button className={getButtonClass('explore')} onClick={() => onNavigate('explore')}>
          <HomeIcon />
          <span className="text-xs font-medium">Explore</span>
        </button>
        <button className={getButtonClass('chat')} onClick={() => onNavigate('chat')}>
          <ChatIcon />
          <span className="text-xs font-medium">AI Chat</span>
        </button>
        <Link to={ROUTES.MESSAGES} className={baseLinkClass}>
            <MessagesIcon />
            <span className="text-xs font-medium">Messages</span>
        </Link>
        <Link to={ROUTES.PROFILE} className={baseLinkClass}>
          <ProfileIcon />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default GuestMobileNav;
