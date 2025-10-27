import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getPaymentHistory } from '../../services/firestoreService';
import { PaymentHistory } from '../../types';
import Spinner from '../../components/ui/Spinner';

const CheckCircleIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} text-green-500`}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;

const plans = [
    { name: 'Basic', price: 'Free', features: ['1 active property listing', 'Basic analytics', 'Email support'], current: false },
    { name: 'Pro', price: '₹2,999/mo', features: ['5 active property listings', 'Advanced analytics', 'iCal Sync', 'Priority support'], current: true },
    { name: 'Business', price: '₹7,999/mo', features: ['Unlimited listings', 'Team access', 'API access', 'Dedicated account manager'], current: false },
];

const InvoiceHistoryTable: React.FC<{ invoices: PaymentHistory[] }> = ({ invoices }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
            <h3 className="font-semibold mb-4 text-lg">Payment History</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {invoices.map(invoice => (
                            <tr key={invoice.invoiceId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{invoice.invoiceId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(invoice.date.seconds * 1000).toLocaleDateString('en-IN')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">₹{invoice.amount.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => alert("Simulating invoice download...")} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1">
                                       <DownloadIcon /> Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SubscriptionPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [invoices, setInvoices] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            getPaymentHistory(currentUser.uid)
                .then(setInvoices)
                .finally(() => setLoading(false));
        }
    }, [currentUser]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Subscription Plans</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">Choose the plan that's right for your business.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(plan => (
              <div key={plan.name} className={`border rounded-lg p-6 flex flex-col ${plan.current ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <p className="text-3xl font-extrabold my-4">{plan.price}</p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 flex-grow">
                      {plan.features.map(feature => (
                          <li key={feature} className="flex items-center gap-2">
                              <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                              <span>{feature}</span>
                          </li>
                      ))}
                  </ul>
                  <button className={`mt-6 w-full py-2 rounded-md font-semibold ${plan.current ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                      {plan.current ? 'Your Current Plan' : 'Choose Plan'}
                  </button>
              </div>
          ))}
      </div>

      {loading ? <div className="mt-8 flex justify-center"><Spinner /></div> : <InvoiceHistoryTable invoices={invoices} />}

    </div>
  );
};

export default SubscriptionPage;