import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBranding } from '../../context/BrandingContext'; // New Import
import { useSettings } from '../../context/SettingsContext';
import { UserRole, MembershipStatus } from '../../types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, sidebarExpanded, setSidebarExpanded }) => {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useAuth();
  const { branding } = useBranding(); 
  const { settings } = useSettings();

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  const getNavLinks = () => {
    const commonLinks = [{ to: '/dashboard', label: 'Dashboard', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' }];
    
    if (!user) return commonLinks;
    
    // Community Hub Link
    const canAccessCommunity = settings.communityHub.enabled && 
                               user.memberDetails &&
                               settings.communityHub.enabledStates.includes(user.memberDetails.state) &&
                               user.memberDetails.forumStatus !== 'banned';

    if (canAccessCommunity) {
      commonLinks.push({ to: '/community', label: 'Community Hub', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' });
    }


    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return [
          ...commonLinks,
          { to: '/approvals', label: 'Member Approvals', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { to: '/payment-approvals', label: 'Payment Approvals', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { to: '/admin-actions', label: 'Admin Actions', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
          { to: '/members', label: 'Member Directory', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { to: '/financials', label: 'Financials', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
          { to: '/communication', label: 'Communication', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
          { to: '/templates', label: 'Templates', icon: 'M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2-2H6a2 2 0 01-2-2V6zm4 2v1h8V8H8zm0 3v1h8v-1H8zm0 3v1h5v-1H8z' },
          { to: '/conference', label: 'Conference', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
          { to: '/roles-permissions', label: 'Roles & Permissions', icon: 'M12 15v2m-6.364-3.636l-1.414 1.414M21 12h-2M12 3v2m-6.364 3.636l-1.414-1.414M12 21a9 9 0 110-18 9 9 0 010 18z' },
          { to: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
        ];
      case UserRole.STATE_ADMIN:
        return [
          ...commonLinks,
          { to: '/approvals', label: 'Approvals', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { to: '/members', label: 'Member Directory', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { to: '/financials', label: 'Financials', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
        ];
      case UserRole.CHAIRMAN:
        return [
          ...commonLinks,
          { to: '/approvals', label: 'Approvals', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { to: '/members', label: 'Member Directory', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        ];
      case UserRole.MEMBER:
        const isActive = user.memberDetails?.status === MembershipStatus.ACTIVE;
        const links = [
            ...commonLinks,
            { to: '/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { to: '/payments', label: 'Payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        ];
        if (isActive) {
            links.push(
                { to: '/id-card', label: 'Digital ID Card', icon: 'M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM10 8a2 2 0 100-4 2 2 0 000 4z' },
                { to: '/certificate', label: 'Certificate', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' }
            );
        }
        return links;
      default:
        return commonLinks;
    }
  };

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 ${sidebarExpanded ? 'lg:w-64' : 'lg:w-20'} shrink-0 bg-primary p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink to="/dashboard" className="block">
            {branding.logoUrl && (
                <img src={branding.logoUrl} alt={`${branding.brandName} Logo`} className={`h-10 w-auto transition-all duration-200 ${sidebarExpanded ? 'lg:w-32' : 'lg:w-10'}`} />
            )}
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase text-gray-400 font-semibold pl-3">Menu</h3>
            <ul className="mt-3">
              {getNavLinks().map(({ to, label, icon }) => (
                <li key={to} className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.startsWith(to) && 'bg-secondary'}`}>
                  <NavLink
                    to={to}
                    className={`block text-gray-200 hover:text-white truncate transition duration-150 ${pathname.startsWith(to) && 'hover:text-gray-200'}`}
                  >
                    <div className="flex items-center">
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path className={`fill-current text-gray-400 ${pathname.startsWith(to) && 'text-accent'}`} d={icon} />
                      </svg>
                      <span className={`text-sm font-medium ml-3 ${sidebarExpanded ? 'lg:opacity-100' : 'lg:opacity-0'} duration-200`}>{label}</span>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex justify-end mt-auto">
            <div className="px-3 py-2">
                <button onClick={setSidebarExpanded} className="p-2 rounded hover:bg-secondary">
                    <span className="sr-only">Expand / collapse sidebar</span>
                     <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {sidebarExpanded ? (
                             <path d="M11 19L4 12L11 5M18 19L11 12L18 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        ) : (
                            <path d="M13 5L20 12L13 19M6 5L13 12L6 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        )}
                    </svg>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;