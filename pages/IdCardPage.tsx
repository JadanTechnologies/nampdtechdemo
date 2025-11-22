
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import DigitalIdCard from '../components/member/DigitalIdCard';

const IdCardPage: React.FC = () => {
    const { user } = useAuth();
    
    if (!user || !user.memberDetails) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>;
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Digital ID Card</h1>
            <p className="text-gray-600 mb-8 max-w-2xl">This is your official digital membership card. You can present this as proof of your active membership with NAMPDTech. Click or tap the card to flip it.</p>
            <div className="flex justify-center">
                <DigitalIdCard member={user.memberDetails} />
            </div>
        </div>
    );
};

export default IdCardPage;
