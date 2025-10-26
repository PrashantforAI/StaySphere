
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
const TripsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.258a1.107 1.107 0 0 0 1.57 1.098l.218-.104a1.107 1.107 0 0 0 .57-1.664c-.352-.622-.242-1.38.216-1.92l.51-.766c.32-.48-.414-1.121.216-1.49l-1.068-.89a1.125 1.125 0 0 1-.405-.864v-.568a1.125 1.125 0 0 1 2.25 0ZM4.5 21.75v-5.172c0-.334.148-.65.405-.864l1.068-.89c.442-.369.535-1.01.216-1.49l-.51-.766a2.25 2.25 0 0 1-1.161-.886l-.143-.048a1.107 1.107 0 0 0-1.57 1.098l-.218.104a1.107 1.107 0 0 0-.57 1.664c.352.622.242 1.38-.216 1.92l-.51.766c-.32.48-.414 1.121-.216 1.49l1.068.89c.257.214.405.53.405.864v5.172a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1 0-4.5h.75a2.25 2.25 0 0 1 2.25 2.25v3.375Z" /></svg>;
const BookingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 3.75h16.5M3.75 17.25h16.5M4.5 12a7.5 7.5 0 0 1 15 0v-1.5a7.5 7.5 0 0 1-15 0v1.5Zm0-1.5a2.25 2.25 0 0 0-2.25 2.25v1.5a2.25 2.25 0 0 0 2.25 2.25m15 0a2.25 2.25 0 0 0 2.25-2.25v-1.5a2.25 2.25 0 0 0-2.25-2.25m-15 0h15" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const PropertiesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m-3-1L9.75 3l-3.75 3.75M3 13.5l6.75-2.5" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Z" /></svg>;
const EarningsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.75A.75.75 0 0 1 2.25 4.5h.75m0 0H3.75m0 0v.75A.75.75 0 0 1 3 6h-.75m0 0H2.25m0 0v.75A.75.75 0 0 1 3 6h-.75m1.5-1.5v.75A.75.75 0 0 1 3 6h-.75m0 0H2.25m9 12.75-3-3m0 0 3-3m-3 3h12.75" /></svg>;
const SubscriptionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18m-3 .75h18A2.25 2.25 0 0 0 21 16.5V7.5A2.25 2.25 0 0 0 18.75 5.25H5.25A2.25 2.25 0 0 0 3 7.5v9A2.25 2.25 0 0 0 5.25 18.75Z" /></svg>;
const ServicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.5 4.5H6.75a4.5 4.5 0 0 1-4.5-4.5V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const ToolboxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75v.255a2.25 2.25 0 0 1-1.125 1.948l-6.75 4.125a2.25 2.25 0 0 1-2.25 0l-6.75-4.125A2.25 2.25 0 0 1 2.25 9.75V9.75m19.5 0-9-5.25m9 5.25-9 5.25m0-5.25-9-5.25m9 5.25V3m0 12.75V21m-6.75-9.75L2.25 9v9.75a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18.75V9" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.602-3.751m-.225-4.012a12.023 12.023 0 0 0-3.449-3.449L12 2.25" /></svg>;
const UpgradeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" /></svg>;


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

  const renderGuestNav = () => (
    <>
        <ul className="space-y-2">
            <li><Link to={ROUTES.DASHBOARD} className={navLinkClasses}><DashboardIcon />Dashboard</Link></li>
            <li><Link to={ROUTES.MY_TRIPS} className={navLinkClasses}><TripsIcon />My Trips</Link></li>
        </ul>
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
             <p className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Upgrade Your Account</p>
             <ul className="space-y-2">
                 <li><Link to={ROUTES.BECOME_HOST} className={navLinkClasses}><UpgradeIcon />Become a Host</Link></li>
                 <li><Link to={ROUTES.BECOME_PROVIDER} className={navLinkClasses}><UpgradeIcon />Become a Service Provider</Link></li>
             </ul>
        </div>
    </>
  );

  const renderHostNav = () => (
    <ul className="space-y-2">
      <li><Link to={ROUTES.HOST_DASHBOARD} className={navLinkClasses}><DashboardIcon />Dashboard</Link></li>
      <li><Link to={ROUTES.HOST_PROPERTIES} className={navLinkClasses}><PropertiesIcon />My Properties</Link></li>
      <li><Link to={ROUTES.HOST_BOOKINGS} className={navLinkClasses}><BookingsIcon />Bookings</Link></li>
      <li><Link to={ROUTES.HOST_CALENDAR} className={navLinkClasses}><CalendarIcon />Calendar</Link></li>
      <li><Link to={ROUTES.HOST_EARNINGS} className={navLinkClasses}><EarningsIcon />Earnings</Link></li>
      <li className="pt-2 border-t border-gray-200 dark:border-gray-600"><Link to={ROUTES.HOST_SERVICE_MARKETPLACE} className={navLinkClasses}><ToolboxIcon />Service Marketplace</Link></li>
      <li><Link to={ROUTES.HOST_SERVICE_ORDERS} className={navLinkClasses}><ServicesIcon />My Service Orders</Link></li>
      <li className="pt-2 border-t border-gray-200 dark:border-gray-600"><Link to={ROUTES.HOST_SUBSCRIPTION} className={navLinkClasses}><SubscriptionIcon />Subscription</Link></li>
    </ul>
  );

  const renderServiceProviderNav = () => (
    <ul className="space-y-2">
        <li><Link to={ROUTES.PROVIDER_DASHBOARD} className={navLinkClasses}><DashboardIcon />Dashboard</Link></li>
        <li><Link to={ROUTES.PROVIDER_JOBS} className={navLinkClasses}><ToolboxIcon />My Jobs</Link></li>
    </ul>
  );
  
  const renderAdminNav = () => (
    <ul className="space-y-2">
        <li><Link to={ROUTES.ADMIN_DASHBOARD} className={navLinkClasses}><AdminIcon />Admin Dashboard</Link></li>
        <li><Link to={ROUTES.ADMIN_PROVIDER_APPROVALS} className={navLinkClasses}><UserIcon />Provider Approvals</Link></li>
    </ul>
  );

  const renderNavForRole = () => {
    switch (userProfile?.role) {
        case UserRole.HOST:
            return renderHostNav();
        case UserRole.SERVICE_PROVIDER:
            return renderServiceProviderNav();
        case UserRole.ADMIN:
            return renderAdminNav();
        case UserRole.GUEST:
        default:
            return renderGuestNav();
    }
  }


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
        {renderNavForRole()}
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