import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { getServiceProviders } from '../../services/firestoreService';
import { ServiceProviderProfile } from '../../types';
import Spinner from '../../components/ui/Spinner';

const AdminProviderApprovalsPage: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceProviders({})
      .then(setProviders)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (providerId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
      // This is a simulation. In a real app, this would call a Firestore update function.
      setProviders(prev => prev.map(p => p.providerId === providerId ? { ...p, verificationStatus: newStatus } : p));
      console.log(`[SIMULATION] Changed provider ${providerId} status to ${newStatus}`);
  };
  
  const getStatusChipColor = (status: 'pending' | 'approved' | 'rejected') => {
      switch(status) {
          case 'approved': return 'bg-green-100 text-green-800';
          case 'pending': return 'bg-yellow-100 text-yellow-800';
          case 'rejected': return 'bg-red-100 text-red-800';
      }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Provider Approvals</h1>

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
                            {providers.map(p => (
                                <tr key={p.providerId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={p.profileImage} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{p.displayName}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{p.providerId.substring(0, 20)}...</div>
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
                            ))}
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
