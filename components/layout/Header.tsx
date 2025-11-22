
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../ui/NotificationBell';

const Header: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 bg-white shadow-md z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Hamburger button for mobile */}
          <div className="flex items-center">
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="w-px h-6 bg-gray-200" />
            <div className="relative inline-flex" >
              <div className="flex items-center truncate">
                 <img className="w-8 h-8 rounded-full mr-2" src={`https://i.pravatar.cc/40?u=${user?.email}`} alt="Avatar" />
                 <div className="truncate">
                    <span className="font-semibold text-sm text-gray-800 truncate">{user?.memberDetails?.fullName || user?.email}</span>
                    <div className="text-xs text-gray-500">{user?.role}</div>
                 </div>
              </div>
            </div>
            <button onClick={logout} className="ml-2 text-sm bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
