import React, { useEffect, useState, useMemo } from 'react';
import { getMembers, updateMember, addAdminAction } from '../services/mockApi';
import { MemberApplication, UserRole, MembershipStatus, AccountStatus, AdminActionType } from '../types';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import Toast from '../components/ui/Toast';
import EditMemberModal from '../components/admin/EditMemberModal';

const MembersPage: React.FC = () => {
    const { user } = useAuth();
    const [allMembers, setAllMembers] = useState<MemberApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [accountStatusFilter, setAccountStatusFilter] = useState('');
    
    // State for account actions (suspend, ban, etc.)
    const [actionMember, setActionMember] = useState<MemberApplication | null>(null);
    const [showActionConfirm, setShowActionConfirm] = useState(false);
    const [actionType, setActionType] = useState<AdminActionType | null>(null);

    // State for forum status actions
    const [forumMember, setForumMember] = useState<MemberApplication | null>(null);
    const [showForumModal, setShowForumModal] = useState(false);
    const [newForumStatus, setNewForumStatus] = useState<'active' | 'muted' | 'banned'>('active');

    // New state for editing member
    const [editingMember, setEditingMember] = useState<MemberApplication | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);


    const fetchMembers = async () => {
        setLoading(true);
        const members = await getMembers();
        if (user?.role === UserRole.STATE_ADMIN || user?.role === UserRole.CHAIRMAN) {
            setAllMembers(members.filter(m => m.state === user.state));
        } else {
            setAllMembers(members);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleAction = async () => {
        if (!actionMember || !actionType || !user) return;
    
        if (user.role === UserRole.SUPER_ADMIN) {
            let updates: Partial<MemberApplication> = {};
            if (actionType === 'Suspend') updates.accountStatus = 'Suspended';
            if (actionType === 'Ban') updates.accountStatus = 'Banned';
            if (actionType === 'Reactivate') updates.accountStatus = 'Active';
            if (actionType === 'Delete') updates.status = MembershipStatus.DELETED;
            
            await updateMember(actionMember.id, updates);
            setToastMessage(`Member has been ${actionType.toLowerCase()}ed.`);
        } else if (user.role === UserRole.STATE_ADMIN) {
            // State Admins request approval from Super Admin
            await addAdminAction({
                memberId: actionMember.id,
                memberName: actionMember.fullName,
                action: actionType,
                requestedBy: user.id,
                requesterRole: user.role,
            });
            setToastMessage(`Request to ${actionType} member has been sent for Super Admin approval.`);
        }
    
        setShowActionConfirm(false);
        setActionMember(null);
        setActionType(null);
        fetchMembers(); // Refresh data
    };
    
    const openActionConfirm = (member: MemberApplication, type: AdminActionType) => {
        setActionMember(member);
        setActionType(type);
        setShowActionConfirm(true);
    };

    const openForumModal = (member: MemberApplication) => {
        setForumMember(member);
        setNewForumStatus(member.forumStatus);
        setShowForumModal(true);
    };

    const handleForumStatusUpdate = async () => {
        if (!forumMember) return;
        
        await updateMember(forumMember.id, { forumStatus: newForumStatus });
        setToastMessage(`Forum status for ${forumMember.fullName} updated to ${newForumStatus}.`);
        
        setShowForumModal(false);
        setForumMember(null);
        fetchMembers(); // Refresh data
    };

    const handleSaveMember = async (updatedMember: MemberApplication) => {
        await updateMember(updatedMember.id, updatedMember);
        setToastMessage(`${updatedMember.fullName}'s profile has been updated.`);
        setEditingMember(null);
        fetchMembers();
    };


    const filteredMembers = useMemo(() => {
        return allMembers
            .filter(member => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    member.fullName.toLowerCase().includes(searchLower) ||
                    member.email.toLowerCase().includes(searchLower) ||
                    member.nin.includes(searchLower)
                );
            })
            .filter(member => statusFilter === '' || member.status === statusFilter)
            .filter(member => accountStatusFilter === '' || member.accountStatus === accountStatusFilter);
    }, [allMembers, searchTerm, statusFilter, accountStatusFilter]);
    
    const getStatusBadge = (status: MembershipStatus) => {
        const styles: { [key: string]: string } = {
            [MembershipStatus.ACTIVE]: 'bg-green-100 text-green-800',
            [MembershipStatus.PENDING_CHAIRMAN]: 'bg-yellow-100 text-yellow-800',
            [MembershipStatus.PENDING_STATE]: 'bg-blue-100 text-blue-800',
            [MembershipStatus.PENDING_PAYMENT]: 'bg-purple-100 text-purple-800',
            [MembershipStatus.PENDING_MANUAL_PAYMENT_CONFIRMATION]: 'bg-orange-100 text-orange-800',
            [MembershipStatus.REJECTED]: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
    }

    const getAccountStatusBadge = (status: AccountStatus) => {
        const styles: { [key: string]: string } = {
            'Active': 'bg-green-100 text-green-800',
            'Suspended': 'bg-yellow-100 text-yellow-800',
            'Banned': 'bg-red-100 text-red-800',
            'Deactivated': 'bg-gray-100 text-gray-800'
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    }

    const getForumStatusBadge = (status: 'active' | 'muted' | 'banned') => {
        const styles: { [key: string]: string } = {
            'active': 'bg-green-100 text-green-800',
            'muted': 'bg-yellow-100 text-yellow-800',
            'banned': 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    }


    return (
        <div>
            {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
            <h1 className="text-3xl font-bold text-dark dark:text-gray-100 mb-6">Member Directory</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or NIN..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md md:col-span-1"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Membership Statuses</option>
                        {Object.values(MembershipStatus).map(status => (
                            status !== MembershipStatus.DELETED && <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                     <select
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        value={accountStatusFilter}
                        onChange={e => setAccountStatusFilter(e.target.value)}
                    >
                        <option value="">All Account Statuses</option>
                        {['Active', 'Suspended', 'Banned', 'Deactivated'].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                {loading ? (
                     <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Contact</th>
                                    <th scope="col" className="px-6 py-3">State</th>
                                    <th scope="col" className="px-6 py-3">Membership</th>
                                    <th scope="col" className="px-6 py-3">Account</th>
                                    <th scope="col" className="px-6 py-3">Forum</th>
                                    <th scope="col" className="px-6 py-3">Joined</th>
                                    {(user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.STATE_ADMIN) && <th scope="col" className="px-6 py-3">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map(member => (
                                    <tr key={member.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{member.fullName}</td>
                                        <td className="px-6 py-4">
                                            <div className="dark:text-gray-300">{member.email}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{member.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">{member.state}</td>
                                        <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                                        <td className="px-6 py-4">{getAccountStatusBadge(member.accountStatus)}</td>
                                        <td className="px-6 py-4">{getForumStatusBadge(member.forumStatus)}</td>
                                        <td className="px-6 py-4">{new Date(member.registrationDate).toLocaleDateString()}</td>
                                         {(user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.STATE_ADMIN) && (
                                            <td className="px-6 py-4">
                                                <div className="relative group">
                                                    <button className="font-medium text-primary hover:underline">Actions ▼</button>
                                                    <div className="absolute z-10 hidden group-hover:block bg-white dark:bg-gray-700 shadow-lg rounded-md right-0 w-40">
                                                        <button onClick={() => setEditingMember(member)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Edit Profile</button>
                                                        <button onClick={() => openActionConfirm(member, 'Suspend')} className="block w-full text-left px-4 py-2 text-sm text-yellow-700 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-600">Suspend</button>
                                                        <button onClick={() => openActionConfirm(member, 'Ban')} className="block w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Ban</button>
                                                        <button onClick={() => openActionConfirm(member, 'Reactivate')} className="block w-full text-left px-4 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600">Reactivate</button>
                                                        <button onClick={() => openForumModal(member)} className="block w-full text-left px-4 py-2 text-sm text-blue-700 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600">Forum Access</button>
                                                        {user.role === UserRole.SUPER_ADMIN && <button onClick={() => openActionConfirm(member, 'Delete')} className="block w-full text-left px-4 py-2 text-sm text-red-800 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>}
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMembers.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">No members found.</p>}
                    </div>
                )}
            </div>
            {showActionConfirm && actionMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Confirm Action</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">Are you sure you want to <strong>{actionType}</strong> the member: <strong>{actionMember.fullName}</strong>?</p>
                            {user?.role === UserRole.STATE_ADMIN && <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-2">This action will be sent to a Super Admin for approval.</p>}
                        </div>
                        <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b">
                            <button onClick={() => setShowActionConfirm(false)} className="bg-gray-200 text-dark dark:bg-gray-600 dark:text-gray-200 py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                            <button onClick={handleAction} className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            {showForumModal && forumMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Forum Access</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">Change the forum status for <strong>{forumMember.fullName}</strong>.</p>
                            <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                                {(['active', 'muted', 'banned'] as const).map(status => (
                                    <label key={status} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="forumStatus"
                                            value={status}
                                            checked={newForumStatus === status}
                                            onChange={() => setNewForumStatus(status)}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500 dark:bg-gray-600"
                                        />
                                        <span className="capitalize text-sm">{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b">
                            <button onClick={() => setShowForumModal(false)} className="bg-gray-200 text-dark dark:bg-gray-600 dark:text-gray-200 py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                            <button onClick={handleForumStatusUpdate} className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
             {editingMember && (
                <EditMemberModal 
                    member={editingMember}
                    onClose={() => setEditingMember(null)}
                    onSave={handleSaveMember}
                />
            )}
        </div>
    );
};

export default MembersPage;
