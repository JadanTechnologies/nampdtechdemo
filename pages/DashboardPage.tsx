
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import AdminDashboard from '../components/admin/AdminDashboard';
import MemberDashboard from '../components/member/MemberDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.STATE_ADMIN:
      case UserRole.CHAIRMAN:
        return <AdminDashboard />;
      case UserRole.MEMBER:
        return <MemberDashboard />;
      default:
        return <div>Welcome!</div>;
    }
  };

  return <>{renderDashboard()}</>;
};

export default DashboardPage;
