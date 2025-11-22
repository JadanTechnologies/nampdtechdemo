
import React, { useEffect, useState, useMemo } from 'react';
import { getPayments } from '../services/mockApi';
import { Payment, UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import { NIGERIAN_STATES } from '../constants';

const FinancialsPage: React.FC = () => {
    const { user } = useAuth();
    const [allPayments, setAllPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [stateFilter, setStateFilter] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            const payments = await getPayments();
            if (user?.role === UserRole.STATE_ADMIN) {
                setAllPayments(payments.filter(p => p.state === user.state));
            } else {
                setAllPayments(payments);
            }
            setLoading(false);
        };
        fetchPayments();
    }, [user]);

    const filteredPayments = useMemo(() => {
        return allPayments.filter(p => stateFilter === '' || p.state === stateFilter);
    }, [allPayments, stateFilter]);

    const totalRevenue = filteredPayments.reduce((acc, payment) => acc + payment.amount, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Financial Overview</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                   <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md" role="alert">
                      <p className="font-bold">Total Revenue (Filtered)</p>
                      <p className="text-2xl">₦{totalRevenue.toLocaleString()}</p>
                    </div>
                   {user?.role === UserRole.SUPER_ADMIN && (
                       <select
                         className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md"
                         value={stateFilter}
                         onChange={e => setStateFilter(e.target.value)}
                       >
                         <option value="">All States</option>
                         {NIGERIAN_STATES.map(state => (
                           <option key={state} value={state}>{state}</option>
                         ))}
                       </select>
                   )}
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Transaction ID</th>
                                    <th scope="col" className="px-6 py-3">Member Name</th>
                                    <th scope="col" className="px-6 py-3">State</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(payment => (
                                    <tr key={payment.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{payment.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{payment.memberName}</td>
                                        <td className="px-6 py-4">{payment.state}</td>
                                        <td className="px-6 py-4">{payment.type}</td>
                                        <td className="px-6 py-4 font-semibold">₦{payment.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">{new Date(payment.date).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredPayments.length === 0 && <p className="text-center py-8 text-gray-500">No transactions found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancialsPage;
