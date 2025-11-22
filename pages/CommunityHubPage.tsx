import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import { getChannels, getMessages, addMessage, getMembers, updateMember, startOnlineStatusSimulator, stopOnlineStatusSimulator } from '../services/mockApi';
import { ChatMessage, MemberApplication, UserRole } from '../types';
import Spinner from '../components/ui/Spinner';
import OnlineStatusIndicator from '../components/ui/OnlineStatusIndicator';

const CommunityHubPage: React.FC = () => {
    const { user } = useAuth();
    const { settings } = useSettings();
    const [channels, setChannels] = useState<string[]>([]);
    const [members, setMembers] = useState<MemberApplication[]>([]);
    const [currentChannel, setCurrentChannel] = useState('General');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            const [fetchedChannels, fetchedMembers] = await Promise.all([
                getChannels(),
                getMembers()
            ]);
            
            const visibleChannels = fetchedChannels.filter(c => c === 'General' || settings.communityHub.enabledStates.includes(c));
            setChannels(visibleChannels);

            const activeMembers = fetchedMembers.filter(m => m.forumStatus !== 'banned' && settings.communityHub.enabledStates.includes(m.state));
            setMembers(activeMembers);

            setLoading(false);
        };
        fetchAllData();
        
        startOnlineStatusSimulator();
        
        const memberStatusInterval = setInterval(async () => {
            const fetchedMembers = await getMembers();
             setMembers(prevMembers => 
                prevMembers.map(pm => {
                    const updatedMember = fetchedMembers.find(fm => fm.id === pm.id);
                    return updatedMember ? {...pm, isOnline: updatedMember.isOnline} : pm;
                })
             );
        }, 3000);

        return () => {
            stopOnlineStatusSimulator();
            clearInterval(memberStatusInterval);
        };

    }, [settings.communityHub.enabledStates]);

    useEffect(() => {
        const fetchMessages = async () => {
            const fetchedMessages = await getMessages(currentChannel);
            setMessages(fetchedMessages);
        };
        fetchMessages();
        
        // Poll for new messages
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);

    }, [currentChannel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const membersInCurrentChannel = useMemo(() => {
        return members
            .filter(m => m.state === currentChannel || currentChannel === 'General')
            .sort((a, b) => {
                // Online users first
                if (a.isOnline && !b.isOnline) return -1;
                if (!a.isOnline && b.isOnline) return 1;
                // Then sort by name
                return a.fullName.localeCompare(b.fullName);
            });
    }, [members, currentChannel]);

    const onlineCount = useMemo(() => {
        return membersInCurrentChannel.filter(m => m.isOnline).length;
    }, [membersInCurrentChannel]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !user.memberDetails) return;
        
        if(user.memberDetails.forumStatus === 'muted'){
            alert("You are currently muted and cannot send messages.");
            return;
        }

        const messageData = {
            channelId: currentChannel,
            senderId: user.id,
            senderName: user.memberDetails.fullName,
            senderRole: user.role,
            content: newMessage,
            type: 'text' as 'text',
        };
        
        const sentMessage = await addMessage(messageData);
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
    };
    
    const handleModeration = async (memberId: string, action: 'mute' | 'ban') => {
        if (!user || user.role !== UserRole.STATE_ADMIN && user.role !== UserRole.SUPER_ADMIN) return;
        const targetMember = members.find(m => m.id === memberId);
        if (!targetMember) return;
        
        if (user.role === UserRole.STATE_ADMIN && user.state !== targetMember.state) {
            alert("You can only moderate members from your own state.");
            return;
        }

        const newStatus = action === 'mute' ? 'muted' : 'banned';
        await updateMember(memberId, { forumStatus: newStatus });
        
        // Optimistically update UI
        setMembers(prev => prev.map(m => m.id === memberId ? {...m, forumStatus: newStatus} : m));
        alert(`User ${targetMember.fullName} has been ${newStatus}.`);
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>;
    }

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <header className="border-b dark:border-gray-700 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-dark dark:text-gray-100"># {currentChannel}</h1>
                <OnlineStatusIndicator />
            </header>
            <div className="flex flex-1 overflow-hidden">
                {/* Channels List */}
                <aside className="w-64 bg-light dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto">
                    <div className="p-4 font-bold text-dark dark:text-gray-200">Channels</div>
                    <ul>
                        {channels.map(channel => (
                            <li key={channel}>
                                <button 
                                    onClick={() => setCurrentChannel(channel)}
                                    className={`w-full text-left px-4 py-2 dark:text-gray-300 ${currentChannel === channel ? 'bg-secondary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                >
                                    # {channel}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col bg-white dark:bg-gray-900">
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className="flex items-start gap-3">
                                <img src={`https://i.pravatar.cc/40?u=${msg.senderId}`} alt={msg.senderName} className="w-10 h-10 rounded-full" />
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-dark dark:text-gray-200">{msg.senderName}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-dark/90 dark:text-gray-300">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t dark:border-gray-700 bg-light dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder={`Message #${currentChannel}`}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                                disabled={user?.memberDetails?.forumStatus === 'muted'}
                            />
                            <button onClick={handleSendMessage} className="bg-primary text-white p-2 rounded-md hover:bg-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" /></svg>
                            </button>
                        </div>
                         {user?.memberDetails?.forumStatus === 'muted' && <p className="text-xs text-yellow-600 mt-1">You are muted and cannot send messages.</p>}
                    </div>
                </main>

                {/* Members List */}
                 <aside className="w-72 bg-light dark:bg-gray-800 border-l dark:border-gray-700 overflow-y-auto">
                    <div className="p-4 font-bold text-dark dark:text-gray-200">
                        Members in #{currentChannel}
                        <span className="text-sm font-normal text-green-600 dark:text-green-400 ml-2">({onlineCount} online)</span>
                    </div>
                     <ul>
                        {membersInCurrentChannel.map(member => (
                             <li key={member.id} className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center group">
                               <div className="flex items-center gap-2">
                                   <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} title={member.isOnline ? 'Online' : 'Offline'}></span>
                                   <div>
                                       <p className="font-semibold text-sm text-dark dark:text-gray-200">{member.fullName}</p>
                                       <p className="text-xs text-gray-500 dark:text-gray-400">{member.role} - {member.state}</p>
                                       {member.forumStatus !== 'active' && <p className="text-xs text-red-500 capitalize font-bold">{member.forumStatus}</p>}
                                   </div>
                               </div>
                                {(user?.role === UserRole.SUPER_ADMIN || (user?.role === UserRole.STATE_ADMIN && user.state === member.state)) && user?.id !== member.userId && (
                                   <div className="hidden group-hover:flex gap-1">
                                       <button onClick={() => handleModeration(member.id, 'mute')} title="Mute User" className="p-1 text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-gray-600 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                                       <button onClick={() => handleModeration(member.id, 'ban')} title="Ban User" className="p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-600 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.367zM14.89 13.477L6.523 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" /></svg></button>
                                   </div>
                               )}
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default CommunityHubPage;