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
                 <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mt-8 text-left">
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
            <div className={`bg-white rounded-xl shadow-lg mt-8 p-6 border-t-8 ${isActive ? 'border-green-500' : 'border-yellow-500'}`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img 
                        src={member.passportPhotoUrl || `https://i.pravatar.cc/150?u=${member.id}`} 
                        alt="Member passport"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                    />
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-dark">{member.fullName}</h2>
                        <p className="text-gray-600">Member ID: <span className="font-mono">{member.id.toUpperCase()}</span></p>
                        <p className="text-gray-600">State: {member.state}</p>
                        <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                             {isActive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                             ) : (
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                             )}
                            Status: {member.status}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-light flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-lg text-center">
                 <div className="flex justify-center items-center gap-4 mb-4">
                    {branding.logoUrl && <img src={branding.logoUrl} alt="Logo" className="h-12 w-auto" />}
                    <h1 className="text-4xl font-bold text-primary">{branding.brandName}</h1>
                </div>
                <p className="text-dark/70 mb-8">Official Member Verification Portal</p>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-dark mb-6">Verify a Member</h2>
                    <form onSubmit={handleSubmit}>
                         <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Enter Membership ID
                        </label>
                         <input
                            type="text"
                            id="memberId"
                            value={memberId}
                            onChange={(e) => setMemberId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary transition"
                            placeholder="e.g., mem-001"
                            required
                        />
                         <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ease-in-out flex items-center justify-center"
                        >
                            {loading ? <Spinner size="sm" /> : 'Verify'}
                        </button>
                    </form>
                </div>
                <ResultCard />
                 <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        <Link to="/" className="font-medium text-primary hover:text-secondary">
                            &larr; Return to Home
                        </Link>
                    </p>
                </div>
             </div>
        </div>
    );
};

export default VerifyMemberPage;
