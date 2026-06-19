import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: 'Inter, sans-serif' },
        }}
      />
      <Routes>
        {/* Admin səhifələri — navbar yoxdur */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* İctimai səhifələr */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/xidmet/:slug" element={<ServicePage />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
