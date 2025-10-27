import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../services/firebase';
import { ROUTES } from '../../constants';

// Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const PropertiesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m-3-1L9.75 3l-3.75 3.75M3 13.5l6.75-2.5" /></svg>;
const BookingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 3.75h16.5M3.75 17.25h16.5M4.5 12a7.5 7.5 0 0 1 15 0v-1.5a7.5 7.5 0 0 1-15 0v1.5Zm0-1.5a2.25 2.25 0 0 0-2.25 2.25v1.5a2.25 2.25 0 0 0 2.25 2.25m15 0a2.25 2.25 0 0 0 2.25-2.25v-1.5a2.25 2.25 0 0 0-2.25-2.25m-15 0h15" /></svg>;
const MessagesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76v-2.52a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 10.24v2.52M2.25 12.76v2.52a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 15.28v-2.52M4.5 15.75v.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375v-.75" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Z" /></svg>;
const EarningsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.75A.75.75 0 0 1 2.25 4.5h.75m0 0H3.75m0 0v.75A.75.75 0 0 1 3 6h-.75m0 0H2.25m0 0v.75A.75.75 0 0 1 3 6h-.75m1.5-1.5v.75A.75.75 0 0 1 3 6h-.75m0 0H2.25m9 12.75-3-3m0 0 3-3m-3 3h12.75" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;
const ChevronDoubleLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>;
const ChevronDoubleRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>;


const HostLayout: React.FC = () => {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        await auth.signOut();
        navigate(ROUTES.HOME);
    };

    const navLinkClasses = "flex items-center p-3 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium";
    const activeNavLinkClasses = "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-200";

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
        return `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`;
    };

    const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
        <NavLink to={to} className={getNavLinkClass}>
            {icon}
            <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-3'}`}>{label}</span>
        </NavLink>
    );

    return (
        <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside className={`relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4 transition-all duration-300 ${isCollapsed ? 'w-20 items-center' : 'w-64'}`}>
                <div className={`mb-8 w-full ${isCollapsed ? 'text-center' : ''}`}>
                    <h1 className={`text-2xl font-bold text-primary-600 dark:text-primary-400 truncate transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>StaySphere AI</h1>
                    <p className={`text-sm text-gray-500 dark:text-gray-400 transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Host Dashboard</p>
                </div>
                
                <nav className="flex-grow space-y-2 w-full">
                    <NavItem to={ROUTES.HOST_DASHBOARD} icon={<DashboardIcon />} label="Dashboard" />
                    <NavItem to={ROUTES.HOST_PROPERTIES} icon={<PropertiesIcon />} label="Listings" />
                    <NavItem to={ROUTES.HOST_BOOKINGS} icon={<BookingsIcon />} label="Bookings" />
                    <NavItem to={ROUTES.HOST_MESSAGES} icon={<MessagesIcon />} label="Messages" />
                    <NavItem to={ROUTES.HOST_CALENDAR} icon={<CalendarIcon />} label="Calendar" />
                    <NavItem to={ROUTES.HOST_EARNINGS} icon={<EarningsIcon />} label="Earnings" />
                    <NavItem to={ROUTES.HOST_PROFILE} icon={<ProfileIcon />} label="Profile Settings" />
                </nav>
                
                <div className="mt-auto w-full">
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                            <img src={userProfile?.profileImage || `https://i.pravatar.cc/150?u=${userProfile?.userId}`} alt="Host" className="w-10 h-10 rounded-full" />
                            <div className={`ml-3 transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                                <p className="font-bold truncate">{userProfile?.displayName}</p>
                                <p className="text-sm text-gray-500 truncate">{userProfile?.email}</p>
                            </div>
                        </div>
                         <button onClick={handleLogout} className={`w-full mt-3 flex items-center p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 ${isCollapsed ? 'justify-center' : ''}`}>
                            <LogoutIcon />
                            <span className={`font-semibold transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 ml-2'}`}>Logout</span>
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    className="absolute -right-3 top-1/2 -translate-y-1/2 p-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 z-10"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default HostLayout;