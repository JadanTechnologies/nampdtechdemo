
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandingProvider, useBranding } from './context/BrandingContext';
import { SettingsProvider } from './context/SettingsContext';
import { GeminiProvider } from './context/GeminiContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/layout/Layout';
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
import { UserRole } from './types';
import CommunicationPage from './pages/CommunicationPage';
import AdminActionsPage from './pages/AdminActionsPage';
import RolesAndPermissionsPage from './pages/RolesAndPermissionsPage';
import ConferencePage from './pages/ConferencePage';
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

  return null; // This component doesn't render anything
}

// Simulated Cron Job Runner
const CronJobRunner: React.FC = () => {
    useEffect(() => {
        // Run once on initial load
        checkAndCreateAnnualDues();

        // Then run every hour
        const interval = setInterval(() => {
            checkAndCreateAnnualDues();
        }, 3600000); // 1 hour

        return () => clearInterval(interval);
    }, []);

    return null;
}


function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <GeminiProvider>
          <BrandingProvider>
            <FaviconUpdater />
            <CronJobRunner />
            <HashRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
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
                    path="/conference" 
                    element={
                      <ProtectedRoute roles={[UserRole.SUPER_ADMIN]}>
                        <ConferencePage />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
                
                 <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </HashRouter>
          </BrandingProvider>
        </GeminiProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;