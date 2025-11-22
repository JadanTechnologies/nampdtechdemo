
import React from 'react';

const ConferencePage: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Live Conference</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-dark mb-4">Virtual Conference Room</h2>
                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                    This feature to host live video conferences with members, chairmen, or state admins is coming soon. 
                    It will allow for real-time meetings, training sessions, and announcements.
                </p>
                <button 
                    className="bg-accent text-primary font-bold py-3 px-8 rounded-md hover:opacity-90 transition disabled:opacity-70 cursor-not-allowed"
                    disabled
                >
                    Start a New Conference
                </button>
            </div>
        </div>
    );
};

export default ConferencePage;
