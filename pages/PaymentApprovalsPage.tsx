
import React, { useEffect, useState } from 'react';
import { getPayments, updatePayment, updateMember } from '../services/mockApi';
import { Payment, PaymentStatus, MembershipStatus } from '../types';
import Spinner from '../components/ui/Spinner';

const PaymentApprovalsPage: React.FC = () => {
    const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const fetchPendingPayments = async () => {
        setLoading(true);
        const allPayments = await getPayments();
        setPendingPayments(allPayments.filter(p => p.status === PaymentStatus.PENDING_CONFIRMATION));
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const handleApproval = async (payment: Payment, approve: boolean) => {
        const newStatus = approve ? PaymentStatus.PAID : PaymentStatus.REJECTED;
        await updatePayment(payment.id, { status: newStatus });
        
        if (approve) {
            await updateMember(payment.memberId, { status: MembershipStatus.ACTIVE });
        } else {
             await updateMember(payment.memberId, { status: MembershipStatus.PENDING_PAYMENT });
        }

        setSelectedPayment(null);
        fetchPendingPayments(); // Refresh list
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Manual Payment Approvals</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
                ) : pendingPayments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No pending payment approvals.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Member Name</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Date Submitted</th>
                                    <th scope="col" className="px-6 py-3">State</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingPayments.map(payment => (
                                    <tr key={payment.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{payment.memberName}</td>
                                        <td className="px-6 py-4">₦{payment.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">{new Date(payment.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{payment.state}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelectedPayment(payment)} className="font-medium text-primary hover:underline">Review</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold text-gray-900">Review Payment</h3>
                                <button onClick={() => setSelectedPayment(null)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                                <p><strong>Member:</strong> {selectedPayment.memberName}</p>
                                <p><strong>Amount:</strong> ₦{selectedPayment.amount.toLocaleString()}</p>
                                <p><strong>Date:</strong> {new Date(selectedPayment.date).toLocaleString()}</p>
                            </div>
                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">Proof of Payment:</h4>
                                {selectedPayment.paymentProofUrl ? (
                                    <a href={selectedPayment.paymentProofUrl} target="_blank" rel="noreferrer">
                                        <img src={selectedPayment.paymentProofUrl} alt="Proof of payment" className="max-w-full h-auto max-h-80 rounded-md border" />
                                    </a>
                                ) : <p className="text-gray-500">No proof was uploaded.</p>}
                            </div>
                        </div>
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                            <button onClick={() => handleApproval(selectedPayment, true)} className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Approve</button>
                            <button onClick={() => handleApproval(selectedPayment, false)} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentApprovalsPage;
