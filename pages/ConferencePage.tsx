

import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';
import { getMembers } from '../services/mockApi';
import { MemberApplication } from '../types';
import Spinner from '../components/ui/Spinner';

const ConferencePage: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [status, setStatus] = useState<'idle' | 'active'>(settings.conference.status);
    const [title, setTitle] = useState('');
    const [members, setMembers] = useState<MemberApplication[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [invitedUserIds, setInvitedUserIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllMembers = async () => {
            setLoadingMembers(true);
            const allMembers = await getMembers();
            setMembers(allMembers.filter(m => m.status === 'Active'));
            setLoadingMembers(false);
        }
        fetchAllMembers();
    }, []);

    const handleStartConference = () => {
        if (!title.trim() || invitedUserIds.length === 0) {
            alert("Please provide a title and invite at least one member.");
            return;
        }
        updateSettings({ 
            conference: { 
                ...settings.conference, 
                status: 'active', 
                title, 
                invitedUserIds 
            }
        });
        setStatus('active');
    };
    
    const handleEndConference = () => {
        updateSettings({ 
            conference: { 
                ...settings.conference, 
                status: 'idle', 
                title: '', 
                invitedUserIds: [] 
            }
        });
        setStatus('idle');
        setTitle('');
        setInvitedUserIds([]);
    };
    
    const handleMemberInviteToggle = (memberId: string) => {
        setInvitedUserIds(prev => 
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const filteredMembers = useMemo(() => {
        return members.filter(member => 
            member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [members, searchTerm]);

    const isConfigured = () => {
        if (settings.conference.provider === 'agora') {
            return settings.apiKeys.agoraAppId && settings.apiKeys.agoraAppCert;
        }
        if (settings.conference.provider === 'zego') {
            return settings.apiKeys.zegoAppId && settings.apiKeys.zegoServerSecret;
        }
        return false;
    };

    const renderIdleState = () => (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
             <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-semibold text-dark dark:text-gray-100 mb-4 text-center">Host Virtual Conference</h2>

            {!isConfigured() ? (
                <div className="max-w-md mx-auto my-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-500/30 text-center">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Conference Provider Not Configured</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Please select a provider and add API keys in settings to enable this feature.
                    </p>
                    <Link to="/settings" className="mt-3 inline-block bg-primary text-white text-sm py-2 px-4 rounded-md hover:bg-secondary transition">
                        Go to Settings
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {/* Left Column: Setup */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg dark:text-gray-200">1. Conference Details</h3>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Conference Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Active Provider: <span className="font-bold capitalize text-primary">{settings.conference.provider}</span>
                        </p>
                         <button 
                            onClick={handleStartConference}
                            className="w-full bg-accent text-primary font-bold py-3 px-8 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!title.trim() || invitedUserIds.length === 0}
                        >
                            Start New Conference
                        </button>
                    </div>

                    {/* Right Column: Invitees */}
                    <div>
                        <h3 className="font-semibold text-lg dark:text-gray-200">2. Invite Members ({invitedUserIds.length})</h3>
                        <input type="text" placeholder="Search members..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-2 mb-2 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        {loadingMembers ? <div className="flex justify-center"><Spinner /></div> : (
                            <div className="h-64 overflow-y-auto border dark:border-gray-600 rounded-md p-2 space-y-2">
                                {filteredMembers.map(member => (
                                    <label key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        <input type="checkbox" checked={invitedUserIds.includes(member.userId)} onChange={() => handleMemberInviteToggle(member.userId)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                        <img src={member.passportPhotoUrl || `https://i.pravatar.cc/40?u=${member.id}`} alt={member.fullName} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="text-sm font-medium text-dark dark:text-gray-200">{member.fullName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.state}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
    
    const renderActiveState = () => (
         <div className="bg-black p-8 rounded-lg shadow-lg text-center aspect-video flex flex-col justify-between items-center text-white">
            <div>
                 <p className="text-lg font-semibold">Conference in Progress: {settings.conference.title}</p>
                 <p className="text-sm opacity-80">Using: <span className="capitalize font-bold">{settings.conference.provider}</span></p>
            </div>
            <div>
                <p className="text-4xl animate-pulse">LIVE</p>
                <p>{invitedUserIds.length} member(s) invited.</p>
            </div>
             <button 
                onClick={handleEndConference}
                className="bg-red-600 text-white font-bold py-3 px-8 rounded-md hover:bg-red-700 transition"
            >
                End Conference
            </button>
        </div>
    );


    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-gray-100 mb-6">Live Conference</h1>
            {status === 'idle' ? renderIdleState() : renderActiveState()}
        </div>
    );
};

export default ConferencePage;