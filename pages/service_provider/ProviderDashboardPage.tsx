import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { getOpenServiceRequests, getServiceBookingsForProvider } from '../../services/firestoreService';
import { ServiceBooking, ServiceBookingStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const JobRequestRow: React.FC<{ job: ServiceBooking }> = ({ job }) => (
    <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md grid grid-cols-4 gap-4 items-center">
        <div className="col-span-2">
            <p className="font-semibold capitalize">{job.serviceType.replace('_', ' ')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{job.propertyTitle}</p>
        </div>
        <p className="text-sm">{new Date(job.requestedDate).toLocaleDateString('en-IN')}</p>
        <div className="text-right">
             <button className="px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700">View & Apply</button>
        </div>
    </div>
);


const ProviderDashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [myBookings, setMyBookings] = useState<ServiceBooking[]>([]);
    const [openRequests, setOpenRequests] = useState<ServiceBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            Promise.all([
                getServiceBookingsForProvider(currentUser.uid),
                getOpenServiceRequests()
            ]).then(([providerBookings, allOpenRequests]) => {
                setMyBookings(providerBookings);
                setOpenRequests(allOpenRequests);
            }).finally(() => setLoading(false));
        }
    }, [currentUser]);
    
    const stats = useMemo(() => {
        const completedJobs = myBookings.filter(b => b.status === ServiceBookingStatus.COMPLETED);
        const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.cost || 0), 0);
        const upcomingJobsCount = myBookings.filter(b => b.status === ServiceBookingStatus.ACCEPTED).length;
        return { totalEarnings, completedJobsCount: completedJobs.length, upcomingJobsCount };
    }, [myBookings]);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"><Header /><div className="flex justify-center mt-20"><Spinner /></div></div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Earnings" value={`₹${stats.totalEarnings.toLocaleString('en-IN')}`} />
                    <StatCard title="Completed Jobs" value={stats.completedJobsCount.toString()} />
                    <StatCard title="Upcoming Jobs" value={stats.upcomingJobsCount.toString()} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* New Job Requests */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">New Job Requests</h2>
                        <div className="space-y-2">
                            {openRequests.length > 0 ? openRequests.slice(0, 5).map(job => <JobRequestRow key={job.serviceBookingId} job={job} />) : <p className="text-gray-500">No new job requests available right now.</p>}
                        </div>
                    </div>
                    {/* My Upcoming Jobs */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">My Upcoming Jobs</h2>
                        <div className="space-y-2">
                             {myBookings.filter(b => b.status === ServiceBookingStatus.ACCEPTED).length > 0 ? 
                                myBookings.filter(b => b.status === ServiceBookingStatus.ACCEPTED).map(job => (
                                    <div key={job.serviceBookingId} className="p-3 grid grid-cols-3 gap-4 items-center">
                                        <div>
                                            <p className="font-semibold capitalize">{job.serviceType.replace('_', ' ')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.propertyTitle}</p>
                                        </div>
                                        <p className="text-sm">{new Date(job.requestedDate).toLocaleDateString('en-IN')}</p>
                                        <p className="text-sm font-semibold text-right">₹{job.cost?.toLocaleString('en-IN')}</p>
                                    </div>
                                )) 
                                : <p className="text-gray-500">You have no upcoming jobs.</p>
                             }
                        </div>
                        <div className="text-right mt-4">
                            <Link to={ROUTES.PROVIDER_JOBS} className="font-semibold text-primary-600 hover:underline">View All Jobs</Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ProviderDashboardPage;
