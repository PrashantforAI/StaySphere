import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getHostBookings } from '../../services/firestoreService';
import { Booking, BookingStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';

const StatCard: React.FC<{ title: string; value: string; subtext?: string }> = ({ title, value, subtext }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        {subtext && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>}
    </div>
);

const EarningsChart: React.FC<{ data: { month: string, earnings: number }[] }> = ({ data }) => {
    const maxEarning = Math.max(...data.map(d => d.earnings), 0);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Monthly Revenue (YTD)</h3>
            <div className="flex justify-around items-end h-64 border-l border-b border-gray-200 dark:border-gray-700 p-2">
                {data.map(({ month, earnings }) => (
                    <div key={month} className="flex flex-col items-center w-1/12">
                        <div
                            className="w-full bg-primary-500 rounded-t-md hover:bg-primary-600"
                            style={{ height: `${maxEarning > 0 ? (earnings / maxEarning) * 100 : 0}%` }}
                            title={`₹${earnings.toLocaleString()}`}
                        ></div>
                        <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">{month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const EarningsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            getHostBookings(currentUser.uid)
                .then(setBookings)
                .finally(() => setLoading(false));
        }
    }, [currentUser]);

    const stats = useMemo(() => {
        const completedBookings = bookings.filter(b => b.bookingStatus === BookingStatus.COMPLETED);
        const totalEarnings = completedBookings.reduce((acc, b) => acc + b.pricing.total, 0);
        const upcomingPayouts = bookings.filter(b => b.bookingStatus === BookingStatus.CONFIRMED || b.bookingStatus === BookingStatus.ONGOING).reduce((acc, b) => acc + b.pricing.total, 0);
        const nightsSold = completedBookings.reduce((acc, b) => acc + b.pricing.nights, 0);
        const avgNightlyRate = nightsSold > 0 ? totalEarnings / nightsSold : 0;
        const occupancyRate = (nightsSold / 365) * 100; // Simplified
        
        const monthlyEarnings = Array(12).fill(0).map((_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'short' }),
            earnings: 0
        }));
        completedBookings.forEach(b => {
            const month = new Date(b.checkIn).getMonth();
            monthlyEarnings[month].earnings += b.pricing.total;
        });

        return { totalEarnings, upcomingPayouts, avgNightlyRate, occupancyRate, monthlyEarnings };
    }, [bookings]);
    
    const handleExport = () => {
        alert("CSV export simulation complete! In a real app, a file would be downloaded.");
    };

    if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Earnings</h1>
          <button onClick={handleExport} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              Export CSV
          </button>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Earnings (YTD)" value={`₹${stats.totalEarnings.toLocaleString('en-IN')}`} />
          <StatCard title="Upcoming Payouts" value={`₹${stats.upcomingPayouts.toLocaleString('en-IN')}`} />
          <StatCard title="Avg. Nightly Rate" value={`₹${stats.avgNightlyRate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
          <StatCard title="Occupancy Rate" value={`${stats.occupancyRate.toFixed(1)}%`} subtext="Simplified annual rate" />
      </div>
      
      {/* Chart */}
      <div className="mb-8">
          <EarningsChart data={stats.monthlyEarnings} />
      </div>
      
      {/* Payouts Table */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">Payout History</h3>
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Property</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {bookings.sort((a,b) => new Date(b.checkOut).getTime() - new Date(a.checkOut).getTime()).map(b => (
                          <tr key={b.bookingId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(b.checkOut).toLocaleDateString('en-IN')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{b.propertyTitle}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{b.bookingStatus.replace(/_/g, ' ')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">₹{b.pricing.total.toLocaleString('en-IN')}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
               {bookings.length === 0 && <p className="text-center py-8 text-gray-500">No payout data available.</p>}
          </div>
      </div>

    </div>
  );
};

export default EarningsPage;