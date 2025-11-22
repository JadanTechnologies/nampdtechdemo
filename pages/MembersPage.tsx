
import React, { useEffect, useState, useMemo } from 'react';
import { getMembers } from '../services/mockApi';
import { MemberApplication, UserRole, MembershipStatus } from '../types';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const MembersPage: React.FC = () => {
    const { user } = useAuth();
    const [allMembers, setAllMembers] = useState<MemberApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
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
        fetchMembers();
    }, [user]);

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
            .filter(member => {
                return statusFilter === '' || member.status === statusFilter;
            });
    }, [allMembers, searchTerm, statusFilter]);
    
    const getStatusBadge = (status: MembershipStatus) => {
        const styles = {
            [MembershipStatus.ACTIVE]: 'bg-green-100 text-green-800',
            [MembershipStatus.PENDING_CHAIRMAN]: 'bg-yellow-100 text-yellow-800',
            [MembershipStatus.PENDING_STATE]: 'bg-blue-100 text-blue-800',
            [MembershipStatus.PENDING_PAYMENT]: 'bg-purple-100 text-purple-800',
            [MembershipStatus.REJECTED]: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    }


    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Member Directory</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or NIN..."
                        className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {Object.values(MembershipStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                {loading ? (
                     <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Contact</th>
                                    <th scope="col" className="px-6 py-3">State</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map(member => (
                                    <tr key={member.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{member.fullName}</td>
                                        <td className="px-6 py-4">
                                            <div>{member.email}</div>
                                            <div className="text-xs text-gray-500">{member.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">{member.state}</td>
                                        <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                                        <td className="px-6 py-4">{new Date(member.registrationDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMembers.length === 0 && <p className="text-center py-8 text-gray-500">No members found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembersPage;
