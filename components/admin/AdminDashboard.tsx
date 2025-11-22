
import React, { useEffect, useState } from 'react';
import { getMembers, getPayments } from '../../services/mockApi';
import { MemberApplication, MembershipStatus, Payment, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import StatCard from './StatCard';
import MemberDistributionChart from './MemberDistributionChart';
import Spinner from '../ui/Spinner';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberApplication[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allMembers = await getMembers();
      const allPayments = await getPayments();

      if (user?.role === UserRole.STATE_ADMIN) {
        setMembers(allMembers.filter(m => m.state === user.state));
        setPayments(allPayments.filter(p => p.state === user.state));
      } else {
        setMembers(allMembers);
        setPayments(allPayments);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>;
  }
  
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === MembershipStatus.ACTIVE).length;
  const pendingMembers = members.filter(m => 
    m.status === MembershipStatus.PENDING_CHAIRMAN || 
    m.status === MembershipStatus.PENDING_STATE ||
    m.status === MembershipStatus.PENDING_PAYMENT
  ).length;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Members" value={totalMembers.toString()} />
        <StatCard title="Active Members" value={activeMembers.toString()} color="green" />
        <StatCard title="Pending Members" value={pendingMembers.toString()} color="yellow" />
        <StatCard title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} color="blue" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-dark mb-4">Member Distribution by State</h2>
        {user?.role === UserRole.SUPER_ADMIN ?
         <MemberDistributionChart members={members} /> :
         <p>State-level charts are coming soon.</p>
        }
      </div>
    </div>
  );
};

export default AdminDashboard;
