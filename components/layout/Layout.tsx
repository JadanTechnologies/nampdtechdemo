import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Check localStorage for user preference on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('sidebar-expanded');
    // Only apply saved preference on desktop view
    if (window.innerWidth >= 1024 && savedPreference) {
      setSidebarExpanded(savedPreference === 'true');
    }
  }, []);

  // Handler to toggle and save preference
  const handleSidebarExpand = () => {
    setSidebarExpanded(prev => {
        const newState = !prev;
        localStorage.setItem('sidebar-expanded', String(newState));
        return newState;
    });
  };


  return (
    <div className="flex h-screen overflow-hidden bg-light dark:bg-gray-900">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={handleSidebarExpand}
      />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;