import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const ConferenceLobbyPage: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [conferenceStatus, setConferenceStatus] = useState(settings.conference.status);

    useEffect(() => {
        // Poll for settings changes to get live status updates
        const interval = setInterval(() => {
            try {
                const storedSettings = localStorage.getItem('nampdtech-settings');
                if (storedSettings) {
                    const latestSettings = JSON.parse(storedSettings);
                    if (latestSettings.conference.status !== conferenceStatus) {
                        setConferenceStatus(latestSettings.conference.status);
                    }
                }
            } catch (e) {
                console.error("Failed to poll for settings", e);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [conferenceStatus]);

    const renderContent = () => {
        switch (conferenceStatus) {
            case 'active':
                return (
                    <div className="bg-black p-8 rounded-lg shadow-lg text-center aspect-video flex flex-col justify-center items-center text-white">
                        <p className="text-2xl font-semibold mb-4">Conference is Live: {settings.conference.title}</p>
                        <p className="text-4xl animate-pulse mb-4">LIVE</p>
                        <p className="text-gray-300">Your meeting is now in progress. Please follow the host's instructions.</p>
                         <p className="text-sm opacity-80 mt-8">Provider: <span className="capitalize font-bold">{settings.conference.provider}</span></p>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                         <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-dark dark:text-gray-100 mb-4">Welcome to the Conference Lobby</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto my-8">
                            You have been invited to the conference: <strong>{settings.conference.title || "Untitled Conference"}</strong>.
                            <br/>
                            Please wait for the host to start the meeting. This page will update automatically.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-gray-100 mb-6">Live Conference</h1>
            {renderContent()}
        </div>
    );
};

export default ConferenceLobbyPage;
