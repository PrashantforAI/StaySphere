
import React from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Removed modular import for signOut, as it will be called as a method on the auth object.
import { auth } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';
import { ROUTES } from '../../constants';

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;

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
  
  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4 text-gray-800 dark:text-gray-200">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
          <UserIcon />
        </div>
        <div>
          <h2 className="font-bold text-lg">{userProfile?.displayName || 'User'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{userProfile?.role}</p>
        </div>
      </div>

      <nav className="flex-grow">
        <ul>
          {/* Add navigation links here */}
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">My Trips</a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Inbox</a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
          </li>
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
