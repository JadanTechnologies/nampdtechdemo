
import React, { useEffect, useState } from 'react';
import { getAdminActions, updateAdminAction, updateMember, getMemberById } from '../services/mockApi';
import { AdminAction, MembershipStatus } from '../types';
import Spinner from '../components/ui/Spinner';

const AdminActionsPage: React.FC = () => {
    const [pendingActions, setPendingActions] = useState<AdminAction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingActions = async () => {
        setLoading(true);
        const allActions = await getAdminActions();
        setPendingActions(allActions.filter(a => a.status === 'Pending'));
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingActions();
    }, []);

    const handleApproval = async (action: AdminAction, approve: boolean) => {
        await updateAdminAction(action.id, { 
            status: approve ? 'Approved' : 'Rejected',
            dateResolved: new Date().toISOString()
        });

        if (approve) {
            const member = await getMemberById(action.memberId);
            if(member) {
                let updates: Partial<typeof member> = {};
                if (action.action === 'Suspend') updates.accountStatus = 'Suspended';
                if (action.action === 'Ban') updates.accountStatus = 'Banned';
                if (action.action === 'Reactivate') updates.accountStatus = 'Active';
                if (action.action === 'Delete') updates.status = MembershipStatus.DELETED;
                
                await updateMember(action.memberId, updates);
            }
        }
        
        fetchPendingActions(); // Refresh list
    };
    
    const getActionBadge = (action: AdminAction['action']) => {
        const styles: { [key: string]: string } = {
            'Suspend': 'bg-yellow-100 text-yellow-800',
            'Ban': 'bg-red-100 text-red-800',
            'Reactivate': 'bg-green-100 text-green-800',
            'Delete': 'bg-red-200 text-red-900',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[action]}`}>{action}</span>;
    }


    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-gray-100 mb-6">Admin Action Approvals</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
                ) : pendingActions.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No pending action requests.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Member Name</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                    <th scope="col" className="px-6 py-3">Requested By</th>
                                    <th scope="col" className="px-6 py-3">Date Requested</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingActions.map(action => (
                                    <tr key={action.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{action.memberName}</td>
                                        <td className="px-6 py-4">{getActionBadge(action.action)}</td>
                                        <td className="px-6 py-4">{action.requestedBy} ({action.requesterRole})</td>
                                        <td className="px-6 py-4">{new Date(action.dateRequested).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => handleApproval(action, true)} className="font-medium text-green-600 hover:underline">Approve</button>
                                            <button onClick={() => handleApproval(action, false)} className="font-medium text-red-600 hover:underline">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminActionsPage;
