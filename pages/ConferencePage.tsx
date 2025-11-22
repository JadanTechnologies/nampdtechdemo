
import React, { useState } from 'react';

type ConferenceProvider = 'agora' | 'zego';
type ConferenceStatus = 'idle' | 'active';

const ConferencePage: React.FC = () => {
    const [provider, setProvider] = useState<ConferenceProvider>('agora');
    const [status, setStatus] = useState<ConferenceStatus>('idle');
    
    const handleStartConference = () => {
        // In a real app, this would initialize the selected SDK
        console.log(`Starting conference with ${provider}...`);
        setStatus('active');
    };
    
    const handleEndConference = () => {
        console.log(`Ending conference.`);
        setStatus('idle');
    };

    const renderIdleState = () => (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-semibold text-dark mb-4">Virtual Conference Room</h2>
             <div className="max-w-md mx-auto my-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Conference Provider</label>
                <div className="grid grid-cols-2 gap-4">
                    <label className={`block p-4 border rounded-lg text-center cursor-pointer ${provider === 'agora' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                        <input type="radio" name="provider" value="agora" checked={provider === 'agora'} onChange={() => setProvider('agora')} className="sr-only"/>
                        <span className="font-semibold">Agora</span>
                    </label>
                    <label className={`block p-4 border rounded-lg text-center cursor-pointer ${provider === 'zego' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                        <input type="radio" name="provider" value="zego" checked={provider === 'zego'} onChange={() => setProvider('zego')} className="sr-only"/>
                        <span className="font-semibold">ZegoCloud</span>
                    </label>
                </div>
            </div>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">
                Host live video conferences with members, chairmen, or state admins for real-time meetings, training sessions, and announcements.
            </p>
            <button 
                onClick={handleStartConference}
                className="bg-accent text-primary font-bold py-3 px-8 rounded-md hover:opacity-90 transition"
            >
                Start New Conference
            </button>
        </div>
    );
    
    const renderActiveState = () => (
         <div className="bg-black p-8 rounded-lg shadow-lg text-center aspect-video flex flex-col justify-between items-center text-white">
            <div>
                 <p className="text-lg font-semibold">Conference in Progress</p>
                 <p className="text-sm opacity-80">Using: <span className="capitalize font-bold">{provider}</span></p>
            </div>
            <div>
                {/* Placeholder for video feeds */}
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
            <h1 className="text-3xl font-bold text-dark mb-6">Live Conference</h1>
            {status === 'idle' ? renderIdleState() : renderActiveState()}
        </div>
    );
};

export default ConferencePage;
