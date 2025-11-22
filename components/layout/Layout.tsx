import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Initialize sidebarExpanded state from localStorage for persistence.
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    try {
      const savedPreference = localStorage.getItem('sidebar-expanded');
      // On desktop, use the saved preference. Default to false on mobile.
      if (window.innerWidth >= 1024) {
        return savedPreference === 'true';
      }
    } catch (error) {
        console.error("Could not read sidebar preference from localStorage", error);
    }
    return false; // Default to collapsed
  });


  // Handler to toggle and save preference to localStorage
  const handleSidebarExpand = () => {
    setSidebarExpanded(prev => {
        const newState = !prev;
        try {
            localStorage.setItem('sidebar-expanded', String(newState));
        } catch (error) {
            console.error("Could not save sidebar preference to localStorage", error);
        }
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
