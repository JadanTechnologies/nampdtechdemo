import React, { useState, useEffect } from 'react';

const OnlineStatusIndicator: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={isOnline ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                {isOnline ? 'Online' : 'Offline'}
            </span>
        </div>
    );
};

export default OnlineStatusIndicator;
