
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Removed modular import for signOut, as it will be called as a method on the auth object.
import { auth } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';
import { ROUTES } from '../../constants';
import { UserRole } from '../../types';

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const TripsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0ZM4.5 21.75v-5.172c0-.334.148-.65.405-.864l1.068-.89c.442-.369.535-1.01.216-1.49l-.51-.766a2.25 2.25 0 0 1-1.161-.886l-.143-.048a1.107 1.107 0 0 0-1.57 1.098l-.218.104a1.107 1.107 0 0 0-.57 1.664c.352.622.242 1.38-.216 1.92l-.51.766c-.32.48-.414 1.121-.216 1.49l1.068.89c.257.214.405.53.405.864v5.172a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1 0-4.5h.75a2.25 2.25 0 0 1 2.25 2.25v3.375Z" /></svg>;
const BookingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 3.75h16.5M3.75 17.25h16.5M4.5 12a7.5 7.5 0 0 1 15 0v-1.5a7.5 7.5 0 0 1-15 0v1.5Zm0-1.5a2.25 2.25 0 0 0-2.25 2.25v1.5a2.25 2.25 0 0 0 2.25 2.25m15 0a2.25 2.25 0 0 0 2.25-2.25v-1.5a2.25 2.25 0 0 0-2.25-2.25m-15 0h15" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;

const LeftPanel: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // FIX: Switched to the v8 compat API style: auth.signOut()
      await auth.signOut();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const navLinkClasses = "flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium";

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4 text-gray-800 dark:text-gray-200">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
          <UserIcon />
        </div>
        <div>
          <h2 className="font-bold text-lg">{userProfile?.displayName || 'User'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{userProfile?.role.replace('_', ' ')}</p>
        </div>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
           <li>
            <Link to={ROUTES.DASHBOARD} className={navLinkClasses}>
                <DashboardIcon />
                Dashboard
            </Link>
          </li>
          {userProfile?.role === UserRole.GUEST && (
             <li>
                <Link to={ROUTES.MY_TRIPS} className={navLinkClasses}>
                    <TripsIcon />
                    My Trips
                </Link>
            </li>
          )}
           {userProfile?.role === UserRole.HOST && (
             <li>
                <Link to={ROUTES.HOST_BOOKINGS} className={navLinkClasses}>
                    <BookingsIcon />
                    My Bookings
                </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Theme</span>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
        >
          <LogoutIcon />
          <span className="ml-2 font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;