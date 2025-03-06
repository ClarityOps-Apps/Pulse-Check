import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SurveyCreator from './pages/SurveyCreator';
import SurveyResponder from './pages/SurveyResponder';
import SurveyResults from './pages/SurveyResults';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import UserProfile from './pages/UserProfile';
import { initializeAppData } from './utils/initialData';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Super Admin route component
const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user?.isSuperAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  // Initialize app data on first load
  useEffect(() => {
    initializeAppData();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/survey/:id" element={<SurveyResponder />} />
          <Route path="/thank-you" element={<ThankYou />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<SurveyCreator />} />
            <Route path="results/:id" element={<SurveyResults />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
          
          {/* Super Admin routes */}
          <Route path="/admin" element={
            <SuperAdminRoute>
              <Layout isAdmin={true} />
            </SuperAdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;