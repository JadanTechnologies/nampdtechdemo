
import React, { useEffect, useState } from 'react';
import { getMembers, updateMember } from '../services/mockApi';
import { MemberApplication, MembershipStatus, UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const ApprovalsPage: React.FC = () => {
    const { user } = useAuth();
    const [pendingMembers, setPendingMembers] = useState<MemberApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<MemberApplication | null>(null);

    const fetchPendingMembers = async () => {
        setLoading(true);
        const allMembers = await getMembers();
        let filteredMembers: MemberApplication[] = [];

        if (user) {
            switch (user.role) {
                case UserRole.SUPER_ADMIN:
                    filteredMembers = allMembers.filter(m => m.status === MembershipStatus.PENDING_CHAIRMAN || m.status === MembershipStatus.PENDING_STATE);
                    break;
                case UserRole.STATE_ADMIN:
                    filteredMembers = allMembers.filter(m => m.state === user.state && m.status === MembershipStatus.PENDING_STATE);
                    break;
                case UserRole.CHAIRMAN:
                    filteredMembers = allMembers.filter(m => m.state === user.state && m.status === MembershipStatus.PENDING_CHAIRMAN);
                    break;
            }
        }
        setPendingMembers(filteredMembers);
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleApproval = async (memberId: string, approve: boolean) => {
        const member = pendingMembers.find(m => m.id === memberId);
        if (!member) return;

        let newStatus: MembershipStatus;
        if (approve) {
            newStatus = member.status === MembershipStatus.PENDING_CHAIRMAN ? MembershipStatus.PENDING_STATE : MembershipStatus.PENDING_PAYMENT;
        } else {
            newStatus = MembershipStatus.REJECTED;
        }

        await updateMember(memberId, { status: newStatus });
        setSelectedMember(null);
        fetchPendingMembers(); // Refresh list
    };
    
    const getStatusBadge = (status: MembershipStatus) => {
        switch(status) {
            case MembershipStatus.PENDING_CHAIRMAN:
                return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pending Chairman</span>
            case MembershipStatus.PENDING_STATE:
                return <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Pending State Admin</span>
            default:
                return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>
        }
    }


    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-gray-100 mb-6">Approvals Queue</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
                ) : pendingMembers.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No pending approvals at the moment.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">State</th>
                                    <th scope="col" className="px-6 py-3">Date Registered</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingMembers.map(member => (
                                    <tr key={member.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{member.fullName}</td>
                                        <td className="px-6 py-4">{member.state}</td>
                                        <td className="px-6 py-4">{new Date(member.registrationDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelectedMember(member)} className="font-medium text-primary hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Review Application</h3>
                                <button onClick={() => setSelectedMember(null)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                <div><strong>Full Name:</strong> {selectedMember.fullName}</div>
                                <div><strong>NIN:</strong> {selectedMember.nin}</div>
                                <div><strong>Email:</strong> {selectedMember.email}</div>
                                <div><strong>Phone:</strong> {selectedMember.phone}</div>
                                <div><strong>State:</strong> {selectedMember.state}</div>
                                <div><strong>LGA:</strong> {selectedMember.lga}</div>
                                {selectedMember.businessName && <div><strong>Business Name:</strong> {selectedMember.businessName}</div>}
                                {selectedMember.businessAddress && <div><strong>Business Address:</strong> {selectedMember.businessAddress}</div>}
                            </div>
                            <div className="mt-4">
                                <h4 className="font-semibold mb-2 dark:text-gray-200">Documents:</h4>
                                <div className="flex gap-4">
                                    {selectedMember.passportPhotoUrl && <a href={selectedMember.passportPhotoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Passport</a>}
                                    {selectedMember.ninSlipUrl && <a href={selectedMember.ninSlipUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">NIN Slip</a>}
                                    {selectedMember.businessDocUrl && <a href={selectedMember.businessDocUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Business Doc</a>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b">
                            <button onClick={() => handleApproval(selectedMember.id, true)} className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Approve</button>
                            <button onClick={() => handleApproval(selectedMember.id, false)} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalsPage;
