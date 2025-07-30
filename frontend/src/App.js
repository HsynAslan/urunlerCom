import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Spinner from './components/Spinner';
import MaintenancePage from './pages/MaintenancePage';

// Admin pages
import AdminLogin from './admin/panel/AdminLogin';
import AdminDashboardPage from './admin/panel/AdminDashboardPage';
import AdminThemePage from './admin/panel/AdminThemePage';
import CreateSubAdminPage from './admin/panel/CreateSubAdminPage';
import AdminSiteSettingsPage from './admin/panel/AdminSiteSettingsPage';
import AdminUsersPage from './admin/panel/AdminUsers';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';

// Public & Auth pages
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage';

// Seller pages
import SellerDashboard from './pages/SellerDashboard';
import CreateCompanyPage from './pages/CreateCompanyPage';
import AddProductPage from './pages/AddProductPage';
import SellerProductsPage from './pages/SellerProductsPage';
import SellerAboutPage from './pages/SellerAboutPage';
import SellerPhotosPage from './pages/SellerPhotosPage';
import SellerPublishPage from './pages/SellerPublishPage';

// Customer pages
import CustomerHome from './pages/CustomerHome';

// Public seller page
import SellerPublicPage from './pages/SellerPublicPage';

import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(null);

useEffect(() => {
  axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/site-info`)
    .then(res => {
      const { maintenanceMode, siteName, frontendUrl, apiUrl, socialLinks, contactPhone } = res.data;
      console.log('Bakım modu:', maintenanceMode);
      setMaintenanceMode(maintenanceMode);  // Bunu ekle, state güncellenir.
      // Diğer ayarları da state'e atabilirsin.
    })
    .catch(err => {
      console.warn('Site bilgileri alınamadı:', err);
      setMaintenanceMode(false); // Hata durumunda bakım modunu kapat.
    });
}, []);


  if (maintenanceMode === null) {
    return <Spinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Admin routes - her zaman açık */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/theme" element={
          <ProtectedAdminRoute requireRoles={['edit_theme']}>
            <AdminThemePage />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/subadmin" element={
          <ProtectedAdminRoute requireRoles={['super_admin']}>
            <CreateSubAdminPage />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/site-settings" element={
          <ProtectedAdminRoute requireRoles={['edit_site_settings']}>
            <AdminSiteSettingsPage />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedAdminRoute requireRoles={['manage_users']}>
            <AdminUsersPage />
          </ProtectedAdminRoute>
        } />

        {maintenanceMode ? (
          // Bakım modu aktifse => sadece admin sayfaları açık, gerisi kapalı
          <Route path="*" element={<MaintenancePage />} />
        ) : (
          <>
            {/* Public routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Seller routes */}
            <Route path="/seller/dashboard" element={
              <ProtectedRoute requireSeller>
                <SellerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/seller/company/create" element={
              <ProtectedRoute requireSeller>
                <CreateCompanyPage />
              </ProtectedRoute>
            } />
            <Route path="/seller/products/add" element={
              <ProtectedRoute requireSeller>
                <AddProductPage />
              </ProtectedRoute>
            } />
            <Route path="/seller/products" element={
              <ProtectedRoute requireSeller>
                <SellerProductsPage />
              </ProtectedRoute>
            } />
            <Route path="/seller/about" element={
              <ProtectedRoute requireSeller>
                <SellerAboutPage />
              </ProtectedRoute>
            } />
            <Route path="/seller/photos" element={
              <ProtectedRoute requireSeller>
                <SellerPhotosPage />
              </ProtectedRoute>
            } />
            <Route path="/seller/publish-page" element={
              <ProtectedRoute requireSeller>
                <SellerPublishPage />
              </ProtectedRoute>
            } />

            {/* Customer route */}
            <Route path="/customer/home" element={
              <ProtectedRoute requireCustomer>
                <CustomerHome />
              </ProtectedRoute>
            } />

            {/* Public seller page */}
            <Route path="/:slug" element={<SellerPublicPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </>
        )}
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        pauseOnHover
      />
    </Router>
  );
}

export default App;
