import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamSession from './pages/ExamSession';
import AdminDashboard from './pages/AdminDashboard';
import AdminSubmissions from './pages/AdminSubmissions';
import AdminUsers from './pages/AdminUsers';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import InstallPWA from './components/InstallPWA';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <LandingPage />;
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="exam/:id" element={<ExamSession />} />
              </Route>

              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <InstallPWA />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
