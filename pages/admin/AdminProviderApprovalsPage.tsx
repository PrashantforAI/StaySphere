import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { getServiceProviders, updateProviderVerificationStatus } from '../../services/firestoreService';
import { ServiceProviderProfile } from '../../types';
import Spinner from '../../components/ui/Spinner';

type ProviderStatusFilter = 'pending' | 'approved' | 'rejected' | 'all';

const AdminProviderApprovalsPage: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProviderStatusFilter>('pending');

  const fetchProviders = async (status: ProviderStatusFilter) => {
    setLoading(true);
    try {
        const statusFilter = status === 'all' ? undefined : status;
        const providerData = await getServiceProviders({ status: statusFilter });
        setProviders(providerData);
    } catch (error) {
        console.error("Failed to fetch providers:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders(filter);
  }, [filter]);

  const handleStatusChange = async (providerId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
      try {
        await updateProviderVerificationStatus(providerId, newStatus);
        setProviders(prev => prev.map(p => p.providerId === providerId ? { ...p, verificationStatus: newStatus } : p));
      } catch (error) {
          alert("Failed to update status. Please check the console.");
          console.error(error);
      }
  };
  
  const getStatusChipColor = (status: 'pending' | 'approved' | 'rejected') => {
      switch(status) {
          case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
          case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
          case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Provider Approvals</h1>

         {/* Filters */}
        <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                {(['pending', 'approved', 'rejected', 'all'] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`capitalize py-2 px-4 text-sm font-medium ${
                        filter === status
                            ? 'border-b-2 border-primary-500 text-primary-600'
                            : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                 {loading ? <div className="p-8 flex justify-center"><Spinner /></div> : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Specialties</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {providers.length > 0 ? providers.map(p => (
                                <tr key={p.providerId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={p.profileImage} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{p.displayName}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{p.providerId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                                        {p.specialties.join(', ').replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipColor(p.verificationStatus)}`}>
                                            {p.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleStatusChange(p.providerId, 'approved')} className="text-green-600 hover:text-green-900 disabled:opacity-50" disabled={p.verificationStatus === 'approved'}>Approve</button>
                                        <button onClick={() => handleStatusChange(p.providerId, 'rejected')} className="text-red-600 hover:text-red-900 disabled:opacity-50" disabled={p.verificationStatus === 'rejected'}>Reject</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500">No providers found for this filter.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProviderApprovalsPage;
