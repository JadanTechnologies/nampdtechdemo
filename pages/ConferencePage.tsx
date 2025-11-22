import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

type ConferenceStatus = 'idle' | 'active';

const ConferencePage: React.FC = () => {
    const { settings } = useSettings();
    const [status, setStatus] = useState<ConferenceStatus>('idle');
    
    const handleStartConference = () => {
        // In a real app, this would initialize the selected SDK
        console.log(`Starting conference with ${settings.conference.provider}...`);
        setStatus('active');
    };
    
    const handleEndConference = () => {
        console.log(`Ending conference.`);
        setStatus('idle');
    };
    
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
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-semibold text-dark mb-4">Virtual Conference Room</h2>
            
            {isConfigured() ? (
                <>
                    <p className="text-gray-600">
                        Active Provider: <span className="font-bold capitalize text-primary">{settings.conference.provider}</span>
                    </p>
                    <p className="text-gray-600 max-w-lg mx-auto my-8">
                        Host live video conferences with members, chairmen, or state admins for real-time meetings, training sessions, and announcements.
                    </p>
                    <button 
                        onClick={handleStartConference}
                        className="bg-accent text-primary font-bold py-3 px-8 rounded-md hover:opacity-90 transition"
                    >
                        Start New Conference
                    </button>
                </>
            ) : (
                <div className="max-w-md mx-auto my-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
                    <h3 className="font-semibold text-yellow-800">Conference Provider Not Configured</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                        Please select a conference provider and enter the necessary API keys in the settings page to enable this feature.
                    </p>
                    <Link to="/settings" className="mt-3 inline-block bg-primary text-white text-sm py-2 px-4 rounded-md hover:bg-secondary transition">
                        Go to Settings
                    </Link>
                </div>
            )}
        </div>
    );
    
    const renderActiveState = () => (
         <div className="bg-black p-8 rounded-lg shadow-lg text-center aspect-video flex flex-col justify-between items-center text-white">
            <div>
                 <p className="text-lg font-semibold">Conference in Progress</p>
                 <p className="text-sm opacity-80">Using: <span className="capitalize font-bold">{settings.conference.provider}</span></p>
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