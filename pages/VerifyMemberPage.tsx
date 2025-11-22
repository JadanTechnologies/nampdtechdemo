
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getMemberById } from '../services/mockApi';
import { MemberApplication, MembershipStatus } from '../types';
import Spinner from '../components/ui/Spinner';
import { useBranding } from '../context/BrandingContext';

const VerifyMemberPage: React.FC = () => {
    const [memberId, setMemberId] = useState('');
    const [member, setMember] = useState<MemberApplication | null | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { branding } = useBranding();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromQuery = queryParams.get('id');
        if (idFromQuery) {
            setMemberId(idFromQuery);
            handleVerification(idFromQuery);
        }
    }, [location.search]);

    const handleVerification = async (id: string) => {
        if (!id) return;
        setLoading(true);
        setMember(undefined); // Reset previous result
        const foundMember = await getMemberById(id);
        setMember(foundMember);
        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleVerification(memberId);
    };

    const ResultCard = () => {
        if (loading) {
            return <div className="flex justify-center mt-8"><Spinner size="lg" /></div>;
        }

        if (member === undefined) {
            return null; // Initial state, no search performed
        }

        if (member === null) {
            return (
                 <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mt-8 text-left dark:bg-red-900/50 dark:text-red-300">
                    <div className="flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div>
                            <h3 className="font-bold">Verification Failed</h3>
                            <p className="text-sm">No member found with the ID: <strong>{memberId}</strong>. Please check the ID and try again.</p>
                        </div>
                    </div>
                </div>
            )
        }
        
        const isActive = member.status === MembershipStatus.ACTIVE;

        return (
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8 p-6 border-t-8 ${isActive ? 'border-green-500' : 'border-yellow-500'}`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img 
                        src={member.passportPhotoUrl || `https://i.pravatar.cc/150?u=${member.id}`} 
                        alt="Member passport"
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-md object-cover"
                    />
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-dark dark:text-gray-100">{member.fullName}</h2>
                        <p className="text-gray-600 dark:text-gray-400">Member ID: <span className="font-mono">{member.id.toUpperCase()}</span></p>
                        <p className="text-gray-600 dark:text-gray-400">State: {member.state}</p>
                        <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300'}`}>
                             {isActive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            )}
                            <span>{member.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-light dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">Member Verification</h1>
                    <p className="text-dark/70 dark:text-gray-400 mt-2">Verify the status of a {branding.brandName} member.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Enter Member ID
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                id="memberId"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                placeholder="e.g., mem-001"
                                className="w-full px-5 py-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:ring-secondary focus:border-secondary transition"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-secondary transition-transform transform hover:scale-105"
                            >
                                {loading ? <Spinner size="sm" /> : 'Verify'}
                            </button>
                        </div>
                    </form>
                    <ResultCard />
                </div>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <Link to="/" className="font-medium text-primary hover:text-secondary">
                            &larr; Back to Home
                        </Link>
                    </p>
                </div>
            </div>
             <footer className="absolute bottom-0 w-full py-4">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} {branding.brandName}. All Rights Reserved.</p>
                    <p className="text-sm mt-1 opacity-50 text-gray-500 dark:text-gray-400">Developed by Jadan Technologies</p>
                </div>
            </footer>
        </div>
    );
};

export default VerifyMemberPage;
