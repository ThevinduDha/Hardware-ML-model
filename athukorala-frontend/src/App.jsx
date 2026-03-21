import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PortalPage from './pages/PortalPage';
import AdminDashboard from './pages/AdminDashboard'; // 1. MAKE SURE TO IMPORT THIS

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          },
        }} 
      />
      
      <Routes>
        {/* Public: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public: Auth (Login/Signup) */}
        <Route path="/login" element={<AuthPage />} />

        <Route path="/auth" element={<AuthPage />} />

        {/* Internal: Staff Portal */}
        <Route path="/portal" element={<PortalPage />} />

        {/* --- ADDED THIS ROUTE TO FIX THE WHITE SCREEN --- */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Auto-redirect any typos back to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;