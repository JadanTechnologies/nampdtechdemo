
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import { getPaymentsByMemberId } from '../services/mockApi';
import { Payment } from '../types';

const PaymentsPage: React.FC = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            if (user?.memberDetails) {
                setLoading(true);
                const memberPayments = await getPaymentsByMemberId(user.memberDetails.id);
                setPayments(memberPayments);
                setLoading(false);
            }
        };
        fetchPayments();
    }, [user]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Payments</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-dark mb-4">Payment History</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-40"><Spinner/></div>
                        ) : payments.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No payment history found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Type</th>
                                            <th scope="col" className="px-6 py-3">Amount</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{new Date(payment.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{payment.type}</td>
                                                <td className="px-6 py-4">₦{payment.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Paid</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
                <div className="md:col-span-1">
                     <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-dark mb-4">Make a Payment</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option>Annual Dues - ₦5,000</option>
                                    <option>Other Levy</option>
                                </select>
                            </div>
                            <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">
                                Proceed to Pay
                            </button>
                             <p className="text-xs text-center text-gray-500">Payment functionality is for demonstration purposes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;
