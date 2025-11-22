

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// FIX: `useAuth` is imported from `hooks/useAuth`, not from `context/AuthContext`.
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { BrandingProvider, useBranding } from './context/BrandingContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { GeminiProvider } from './context/GeminiContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Spinner from './components/ui/Spinner';

// Page Imports
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApprovalsPage from './pages/ApprovalsPage';
import MembersPage from './pages/MembersPage';
import FinancialsPage from './pages/FinancialsPage';
import ProfilePage from './pages/ProfilePage';
import IdCardPage from './pages/IdCardPage';
import CertificatePage from './pages/CertificatePage';
import PaymentsPage from './pages/PaymentsPage';
import LandingPage from './pages/LandingPage';
import SettingsPage from './pages/SettingsPage';
import PaymentApprovalsPage from './pages/PaymentApprovalsPage';
import CommunicationPage from './pages/CommunicationPage';
import AdminActionsPage from './pages/AdminActionsPage';
import RolesAndPermissionsPage from './pages/RolesAndPermissionsPage';
import ConferenceSwitchPage from './pages/ConferenceSwitchPage';
import TemplatesPage from './pages/TemplatesPage';
import MaintenancePage from './pages/MaintenancePage';
import VerifyMemberPage from './pages/VerifyMemberPage';
import CommunityHubPage from './pages/CommunityHubPage';


import { UserRole } from './types';
import { checkAndCreateAnnualDues } from './services/mockApi';


// Component to handle dynamic favicon updates
const FaviconUpdater: React.FC = () => {
  const { branding } = useBranding();
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && branding.faviconUrl) {
      favicon.setAttribute('href', branding.faviconUrl);
    }
  }, [branding.faviconUrl]);
  return null;
}

// Simulated Cron Job Runner
const CronJobRunner: React.FC = () => {
    useEffect(() => {
        const interval = setInterval(() => { checkAndCreateAnnualDues(); }, 3600000); // 1 hour
        return () => clearInterval(interval);
    }, []);
    return null;
}

// Maintenance Mode Checker
const MaintenanceModeChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { settings, loading: settingsLoading } = useSettings();
    const { user, loading: authLoading } = useAuth();
    
    if (settingsLoading || authLoading) {
        return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
    }

    const isUnderMaintenance = settings.maintenanceMode.enabled;
    const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

    if (isUnderMaintenance && !isSuperAdmin) {
        return <MaintenancePage message={settings.maintenanceMode.message} />;
    }

    return (
        <>
            {isUnderMaintenance && isSuperAdmin && (
                <div className="bg-yellow-500 text-center text-white p-2 font-bold fixed top-0 w-full z-[100]">
                    Maintenance Mode is ACTIVE. Only Super Admins can access the site.
                </div>
            )}
            {children}
        </>
    );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <GeminiProvider>
            <BrandingProvider>
              <NotificationProvider>
                <FaviconUpdater />
                <CronJobRunner />
                <MaintenanceModeChecker>
                  <HashRouter>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/verify" element={<VerifyMemberPage />} />

                      
                      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/approvals" element={<ApprovalsPage />} />
                         <Route 
                          path="/payment-approvals" 
                          element={
                            <ProtectedRoute roles={[UserRole.SUPER_ADMIN]}>
                              <PaymentApprovalsPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route path="/members" element={<MembersPage />} />
                        <Route path="/financials" element={<FinancialsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/id-card" element={<IdCardPage />} />
                        <Route path="/certificate" element={<CertificatePage />} />
                        <Route path="/payments" element={<PaymentsPage />} />
                        <Route path="/community" element={<CommunityHubPage />} />
                        <Route 
                          path="/settings" 
                          element={
                            <ProtectedRoute roles={[UserRole.SUPER_ADMIN]}>
                              <SettingsPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/communication" 
                          element={
                            <ProtectedRoute roles={[UserRole.SUPER_ADMIN]}>
                              <CommunicationPage />
                            </ProtectedRoute>
                          } 
                        />
                         <Route 
                          path="/admin-actions" 
                          element={
                            <ProtectedRoute roles={[UserRole.SUPER_ADMIN]}>
                              <AdminActionsPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/roles-permissions" 
                          element={
                            <ProtectedRoute roles={[UserRole.SUPER_ADMIN]}>
                              <RolesAndPermissionsPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/templates" 
                          element={
                            <ProtectedRoute roles={[UserRole.SUPER_ADMIN]}>
                              <TemplatesPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/conference" 
                          element={
                            <ProtectedRoute>
                              <ConferenceSwitchPage />
                            </ProtectedRoute>
                          } 
                        />
                      </Route>
                      
                       <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </HashRouter>
                </MaintenanceModeChecker>
              </NotificationProvider>
            </BrandingProvider>
          </GeminiProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;