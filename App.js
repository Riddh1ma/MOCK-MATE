import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import CodingTest from './pages/CodingTest';
import BehavioralInterview from './pages/BehavioralInterview';
import InterviewScheduler from './pages/InterviewScheduler';
import Performance from './pages/Performance';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="practice" element={<Practice />} />
              <Route path="coding/:questionId" element={<CodingTest />} />
              <Route path="behavioral/:questionId" element={<BehavioralInterview />} />
              <Route path="schedule" element={<InterviewScheduler />} />
              <Route path="performance" element={<Performance />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
