import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { getHostProperties, getHostBookings } from '../../services/firestoreService';
import { Property, Booking, BookingStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
// FIX: Imported the ROUTES constant to be used in the link.
import { ROUTES } from '../../constants';

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;

const PropertyCalendarPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [modalDate, setModalDate] = useState<Date | null>(null);
    const [blockedDates, setBlockedDates] = useState<Record<string, string>>({}); // date -> reason
    
    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                const [hostProperties, hostBookings] = await Promise.all([
                    getHostProperties(currentUser.uid),
                    getHostBookings(currentUser.uid),
                ]);
                setProperties(hostProperties);
                setBookings(hostBookings);
                if (hostProperties.length > 0) {
                    setSelectedPropertyId(hostProperties[0].propertyId);
                }
            } catch (err) {
                console.error("Failed to load calendar data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    const { month, year, daysInMonth, firstDayOfMonth } = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return { month, year, daysInMonth, firstDayOfMonth };
    }, [currentDate]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const getDayStatus = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (blockedDates[dateStr]) return { status: 'blocked', text: blockedDates[dateStr] };

        const bookingOnDate = bookings.find(b => 
            b.propertyId === selectedPropertyId && dateStr >= b.checkIn && dateStr <= b.checkOut
        );

        if (bookingOnDate) {
            const isConfirmed = bookingOnDate.bookingStatus === BookingStatus.CONFIRMED || bookingOnDate.bookingStatus === BookingStatus.ONGOING;
            return {
                status: isConfirmed ? 'confirmed' : 'pending',
                text: `Booking: ${bookingOnDate.bookingId.slice(-4)}`
            };
        }
        
        return { status: 'available', text: 'Available' };
    };

    const handleBlockDate = () => {
        if (modalDate) {
            const dateStr = modalDate.toISOString().split('T')[0];
            setBlockedDates(prev => ({ ...prev, [dateStr]: 'Manually Blocked' }));
            setModalDate(null);
        }
    };
    
    const handleUnblockDate = () => {
        if (modalDate) {
            const dateStr = modalDate.toISOString().split('T')[0];
            const newBlockedDates = { ...blockedDates };
            delete newBlockedDates[dateStr];
            setBlockedDates(newBlockedDates);
            setModalDate(null);
        }
    };
    
    const renderCalendar = () => {
        const dayElements = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            dayElements.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200 dark:border-gray-700"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const { status, text } = getDayStatus(day);
            let bgColor = 'bg-white dark:bg-gray-800';
            let textColor = 'text-gray-900 dark:text-white';
            if (status === 'confirmed') { bgColor = 'bg-green-200 dark:bg-green-900'; }
            if (status === 'pending') { bgColor = 'bg-yellow-200 dark:bg-yellow-900'; }
            if (status === 'blocked') { bgColor = 'bg-gray-300 dark:bg-gray-600'; textColor = 'text-gray-500 dark:text-gray-400'; }
            
            dayElements.push(
                <div key={day} onClick={() => setModalDate(new Date(year, month, day))} className={`p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-opacity-70 ${bgColor} transition-colors`}>
                    <div className="font-bold">{day}</div>
                    <div className={`text-xs truncate ${textColor}`}>{text}</div>
                </div>
            );
        }
        return dayElements;
    };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Calendar Management</h1>
        
        {loading ? <Spinner /> : properties.length > 0 ? (
            <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-grow">
                    <label htmlFor="property-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Property</label>
                    <select
                        id="property-select"
                        value={selectedPropertyId}
                        onChange={(e) => setSelectedPropertyId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        {properties.map(p => <option key={p.propertyId} value={p.propertyId}>{p.title}</option>)}
                    </select>
                </div>
                <div className="flex-shrink-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 invisible">Sync</label>
                    <button className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                        Sync iCal
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon /></button>
                    <h2 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon /></button>
                </div>
                <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 h-[60vh] overflow-y-auto border-t border-l border-gray-200 dark:border-gray-700">
                    {renderCalendar()}
                </div>
            </div>
            </>
        ) : (
             <p>You have no properties to manage. <a href={ROUTES.HOST_ADD_PROPERTY} className="text-primary-600">Add a property</a> to get started.</p>
        )}
        
        {/* Date Action Modal */}
        {modalDate && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">{modalDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                        <button onClick={() => setModalDate(null)}><CloseIcon /></button>
                    </div>
                    <p className="mb-4 text-sm">Status: <span className="font-semibold">{getDayStatus(modalDate.getDate()).text}</span></p>
                    <div className="flex flex-col gap-2">
                        {getDayStatus(modalDate.getDate()).status === 'available' && <button onClick={handleBlockDate} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">Block this date</button>}
                        {getDayStatus(modalDate.getDate()).status === 'blocked' && <button onClick={handleUnblockDate} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Unblock this date</button>}
                        <button onClick={() => setModalDate(null)} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Close</button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default PropertyCalendarPage;