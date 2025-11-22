import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import ConferencePage from './ConferencePage';
import ConferenceLobbyPage from './ConferenceLobbyPage';
import Spinner from '../components/ui/Spinner';

const ConferenceSwitchPage: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>;
    }

    if (!user) {
        return <div>Error: User not found.</div>;
    }
    
    // Super Admins get the host controls
    if (user.role === UserRole.SUPER_ADMIN) {
        return <ConferencePage />;
    }
    
    // All other invited users get the lobby
    return <ConferenceLobbyPage />;
};

export default ConferenceSwitchPage;
