
import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const dropdown = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!dropdown.current || !trigger.current) return;
            if (!isDropdownOpen || dropdown.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
            setIsDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [isDropdownOpen]);
    
    // Close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!isDropdownOpen || keyCode !== 27) return;
            setIsDropdownOpen(false);
        };
        document.addEventListener('keyup', keyHandler);
        return () => document.removeEventListener('keyup', keyHandler);
    }, [isDropdownOpen]);


    const handleMarkAllRead = () => {
        markAllAsRead();
    };

    return (
        <div className="relative inline-flex">
            <button
                ref={trigger}
                className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ${isDropdownOpen && 'bg-slate-200'}`}
                aria-haspopup="true"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
            >
                <span className="sr-only">Notifications</span>
                {/* Bell Icon */}
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {unreadCount > 0 && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-xs text-white flex items-center justify-center">
                        {unreadCount}
                    </div>
                )}
            </button>

            {isDropdownOpen && (
                 <div
                    ref={dropdown}
                    className="origin-top-right z-10 absolute top-full right-0 -mr-48 sm:mr-0 min-w-80 bg-white border border-slate-200 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1"
                >
                    <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4">Notifications</div>
                     <ul>
                        {notifications.slice(0, 5).map(notification => (
                            <li key={notification.id} className={`border-b border-slate-200 last:border-0 ${!notification.read ? 'bg-blue-50' : ''}`}>
                                <Link
                                    className="block py-2 px-4 hover:bg-slate-50"
                                    to={notification.link || '#'}
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <span className="block text-sm mb-2">
                                        {notification.message}
                                    </span>
                                    <span className="block text-xs font-medium text-slate-400">
                                        {new Date(notification.date).toLocaleString()}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                     {notifications.length === 0 && <div className="text-center py-4 text-sm text-gray-500">No new notifications.</div>}
                    {unreadCount > 0 && (
                        <div className="py-2 px-4 border-t border-slate-200 bg-slate-50">
                           <button onClick={handleMarkAllRead} className="text-xs font-bold text-primary hover:underline w-full text-center">
                                Mark all as read
                           </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
