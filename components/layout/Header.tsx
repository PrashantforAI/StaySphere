import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import { ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { getUserNotifications, markNotificationAsRead } from '../../services/firestoreService';
import { Notification } from '../../types';
import Spinner from '../ui/Spinner';

const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;

const NotificationsBell: React.FC = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;
        
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const userNotifications = await getUserNotifications(currentUser.uid);
                setNotifications(userNotifications);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
            setLoading(false);
        };

        fetchNotifications();
    }, [currentUser]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (notificationId: string) => {
        await markNotificationAsRead(notificationId);
        setNotifications(prev =>
            prev.map(n => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
        );
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.notificationId);
        }
        // Navigate to the relevant page
        if (notification.type.includes('booking')) {
            navigate(ROUTES.BOOKING_DETAIL.replace(':bookingId', notification.referenceId));
        }
        setIsOpen(false);
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
                    <div className="p-3 font-bold border-b border-gray-200 dark:border-gray-700">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? <div className="p-4"><Spinner /></div> :
                         notifications.length === 0 ? <div className="p-4 text-sm text-gray-500">No new notifications.</div> :
                         notifications.map(n => (
                            <div
                                key={n.notificationId}
                                onClick={() => handleNotificationClick(n)}
                                className={`p-3 flex items-start gap-3 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!n.isRead ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                            >
                                <div className="flex-grow">
                                    <p className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{n.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                                </div>
                                {!n.isRead && (
                                    <button
                                        title="Mark as read"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkAsRead(n.notificationId);
                                        }}
                                        className="p-1 text-gray-400 hover:text-primary-600"
                                    >
                                        <CheckIcon />
                                    </button>
                                )}
                            </div>
                         ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const Header: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={ROUTES.HOME} className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          StaySphere AI
        </Link>
        <div className="flex items-center gap-2">
            {currentUser && <NotificationsBell />}
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;