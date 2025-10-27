import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getHostProperties, getHostBookings } from '../../services/firestoreService';
import { Property, Booking, BookingStatus, PropertyStatus, HostInsight } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { generateHostInsights } from '../../services/geminiService';

// Icons
const CurrencyRupeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9.75a2.25 2.25 0 0 0 0 4.5h3a2.25 2.25 0 0 1 0 4.5H9.75m5.25-8.25h.008v.008H15V8.25Zm0 0H15m0 0h.008v.008H15v-.008Zm0 0v.008h.008v-.008H15Zm-1.5-1.5H12a3 3 0 0 0-3 3V12a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3V7.5a3 3 0 0 0-3-3Z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.11a.75.75 0 0 0 .44 1.282l5.519.542a.75.75 0 0 1 .585.645l.21 5.23a.75.75 0 0 0 1.364-.12l.21-5.23a.75.75 0 0 1 .585-.645l5.519-.542a.75.75 0 0 0 .44-1.282l-3.423-3.11-4.753-.39-1.83-4.401Z" clipRule="evenodd" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const HostDashboardPage: React.FC = () => {
    const { currentUser, userProfile } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [insights, setInsights] = useState<HostInsight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            try {
                const [hostProperties, hostBookings] = await Promise.all([
                    getHostProperties(currentUser.uid),
                    getHostBookings(currentUser.uid),
                ]);
                setProperties(hostProperties);
                setBookings(hostBookings);

                // Generate AI insights after data is fetched
                const aiInsights = await generateHostInsights(hostProperties, hostBookings);
                setInsights(aiInsights);

            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    const stats = useMemo(() => {
        const completedBookings = bookings.filter(b => b.bookingStatus === BookingStatus.COMPLETED);
        const totalEarnings = completedBookings.reduce((acc, b) => acc + b.pricing.total, 0);
        const upcomingPayouts = bookings.filter(b => b.bookingStatus === BookingStatus.CONFIRMED || b.bookingStatus === BookingStatus.ONGOING).reduce((acc, b) => acc + b.pricing.total, 0);
        const activeListings = properties.filter(p => p.status === PropertyStatus.ACTIVE).length;
        return { totalEarnings, upcomingPayouts, activeListings };
    }, [bookings, properties]);

    const recentBookings = bookings
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        .slice(0, 5);

    if (loading) {
        return <div className="p-8 flex justify-center mt-20"><Spinner /></div>;
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-1">Welcome back, {userProfile?.displayName}!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Here's a snapshot of your hosting activity.</p>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Earnings (Completed)" value={`₹${stats.totalEarnings.toLocaleString('en-IN')}`} icon={<CurrencyRupeeIcon />} color="bg-green-500" />
                <StatCard title="Upcoming Payouts" value={`₹${stats.upcomingPayouts.toLocaleString('en-IN')}`} icon={<CurrencyRupeeIcon />} color="bg-blue-500" />
                <StatCard title="Active Listings" value={stats.activeListings.toString()} icon={<HomeIcon />} color="bg-purple-500" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI-Powered Insights */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <SparklesIcon /> AI-Powered Insights
                    </h2>
                    <div className="space-y-4">
                        {insights.length > 0 ? insights.map((insight, index) => (
                            <div key={index} className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg border border-primary-200 dark:border-primary-500/30">
                                <h3 className="font-semibold text-primary-800 dark:text-primary-200">{insight.title}</h3>
                                <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">{insight.message}</p>
                                {insight.ctaLink && (
                                    <Link to={insight.ctaLink} className="text-sm font-bold text-primary-600 hover:underline mt-2 inline-block">
                                        {insight.ctaText || 'Take Action'} &rarr;
                                    </Link>
                                )}
                            </div>
                        )) : <p className="text-sm text-gray-500">No new insights right now. Everything looks great!</p>}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Property</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payout</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {recentBookings.length > 0 ? recentBookings.map(b => (
                                    <tr key={b.bookingId}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{b.propertyTitle}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(b.checkIn).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})} - {new Date(b.checkOut).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm capitalize">{b.bookingStatus.replace(/_/g, ' ')}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">₹{b.pricing.total.toLocaleString('en-IN')}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-500">No recent bookings.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostDashboardPage;