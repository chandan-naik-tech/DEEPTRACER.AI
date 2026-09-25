import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AnalysisPipeline from './pages/AnalysisPipeline';
import ReportPage from './pages/ReportPage';
import SettingsPage from './pages/SettingsPage';
import NewAnalysisPage from './pages/NewAnalysisPage';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { SessionProvider } from './context/SessionContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <ConfigProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage type="user" />} />
            <Route path="/admin/login" element={<LoginPage type="admin" />} />
            
            <Route path="/app" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="new-analysis" element={<NewAnalysisPage />} />
              <Route path="analysis/:id" element={<AnalysisPipeline />} />
              <Route path="reports" element={<ReportPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ConfigProvider>
      </SessionProvider>
    </AuthProvider>
  );
}

export default App;
