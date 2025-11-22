
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import SettingsPage from './pages/SettingsPage'; // New Import
import { UserRole } from './types'; // New Import

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
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
          </Route>
          
           <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
