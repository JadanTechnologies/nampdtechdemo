
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import { getPaymentsByMemberId, addPayment, updateMember } from '../services/mockApi';
import { Payment, MembershipStatus, PaymentGateway, PaymentStatus } from '../types';
import { useSettings } from '../context/SettingsContext';
import FileUpload from '../components/registration/FileUpload';

const PaymentsPage: React.FC = () => {
    const { user, updateUserMemberDetails } = useAuth();
    const { settings } = useSettings();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleManualPaymentSubmit = async () => {
        if (!paymentProof || !user?.memberDetails) {
            alert("Please upload proof of payment.");
            return;
        }
        setIsSubmitting(true);
        const amount = 15000; // Registration + Annual Dues
        await addPayment({
            member: user.memberDetails,
            type: 'Registration Fee',
            amount: amount,
            gateway: PaymentGateway.MANUAL,
            status: PaymentStatus.PENDING_CONFIRMATION,
            paymentProofUrl: URL.createObjectURL(paymentProof)
        });
        await updateMember(user.memberDetails.id, { status: MembershipStatus.PENDING_MANUAL_PAYMENT_CONFIRMATION });
        await updateUserMemberDetails();
        setIsSubmitting(false);
        setShowManualPaymentModal(false);
        alert("Your proof of payment has been submitted for review.");
    }

    const GatewayButton = ({ name, enabled, onClick }: { name: string, enabled: boolean, onClick: () => void }) => (
        <button 
            onClick={onClick}
            disabled={!enabled}
            className={`w-full text-left p-4 border rounded-lg transition dark:border-gray-600 ${enabled ? 'hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/20 cursor-pointer' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'}`}>
            <h3 className="font-semibold text-dark dark:text-gray-200">{name}</h3>
            {!enabled && <p className="text-xs">Currently unavailable</p>}
        </button>
    )

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-gray-100 mb-6">Payments</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4">Payment History</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-40"><Spinner/></div>
                        ) : payments.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No payment history found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Type</th>
                                            <th scope="col" className="px-6 py-3">Amount</th>
                                            <th scope="col" className="px-6 py-3">Gateway</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4">{new Date(payment.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{payment.type}</td>
                                                <td className="px-6 py-4">₦{payment.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">{payment.gateway}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        payment.status === PaymentStatus.PAID ? 'text-green-800 bg-green-100' : 
                                                        payment.status === PaymentStatus.PENDING_CONFIRMATION ? 'text-yellow-800 bg-yellow-100' : 'text-red-800 bg-red-100'}`
                                                    }>{payment.status}</span>
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
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4">Make a Payment</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select your preferred payment method to pay your dues.</p>
                        <div className="space-y-3">
                            <GatewayButton name="Pay with Paystack" enabled={settings.paymentGateways.paystackEnabled} onClick={() => alert("Paystack integration coming soon!")} />
                            <GatewayButton name="Pay with Monnify" enabled={settings.paymentGateways.monnifyEnabled} onClick={() => alert("Monnify integration coming soon!")} />
                            <GatewayButton name="Pay with Flutterwave" enabled={settings.paymentGateways.flutterwaveEnabled} onClick={() => alert("Flutterwave integration coming soon!")} />
                            <GatewayButton name="Manual Bank Transfer" enabled={true} onClick={() => setShowManualPaymentModal(true)} />
                        </div>
                    </div>
                </div>
            </div>

            {showManualPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-6">
                             <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Manual Payment</h3>
                                <button onClick={() => setShowManualPaymentModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <h4 className="font-semibold dark:text-gray-200">Instructions:</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{settings.paymentGateways.manualPaymentInstructions}</p>
                                </div>
                                <div>
                                    <FileUpload 
                                        label="Upload Proof of Payment"
                                        onFileChange={setPaymentProof}
                                        acceptedTypes="image/jpeg,image/png,application/pdf"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b">
                            <button onClick={() => setShowManualPaymentModal(false)} className="bg-gray-200 text-dark dark:bg-gray-600 dark:text-gray-200 py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                            <button onClick={handleManualPaymentSubmit} disabled={isSubmitting || !paymentProof} className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
                                {isSubmitting ? <><Spinner size="sm"/> Submitting...</> : 'Submit for Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;
