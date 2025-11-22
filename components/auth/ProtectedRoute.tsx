
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';
import { UserRole } from '../../types';

const ProtectedRoute: React.FC<{ children: ReactNode; roles?: UserRole[] }> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(user.role)) {
    // If user's role is not in the allowed roles, redirect them.
    return <Navigate to="/dashboard" replace />;
  }


  return <>{children}</>;
};

export default ProtectedRoute;
