import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

import { AnimatePresence, motion } from 'framer-motion';

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
import SellerStatisticsPage from './pages/SellerStatisticsPage';

// Customer pages
import CustomerHome from './pages/CustomerHome';

// Public seller page
import SellerPublicPage from './pages/SellerPublicPage';

import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Sayfa animasyonları için wrapper bileşeni ---
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}     // Sayfa açılırken sağdan ve opaklık 0
      animate={{ opacity: 1, x: 0 }}      // Görünür ve orijinal pozisyon
      exit={{ opacity: 0, x: -50 }}       // Sayfa kapanırken sola doğru kayıp opaklık azalır
      transition={{ duration: 0.4 }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
}

// --- Animasyonlu Routes sarmalayıcı ---
function AnimatedRoutes({ maintenanceMode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Admin routes - her zaman açık */}
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/dashboard" element={
          <PageTransition>
            <ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute>
          </PageTransition>
        } />
        <Route path="/admin/theme" element={
          <PageTransition>
            <ProtectedAdminRoute requireRoles={['edit_theme']}><AdminThemePage /></ProtectedAdminRoute>
          </PageTransition>
        } />
        <Route path="/admin/subadmin" element={
          <PageTransition>
            <ProtectedAdminRoute requireRoles={['super_admin']}><CreateSubAdminPage /></ProtectedAdminRoute>
          </PageTransition>
        } />
        <Route path="/admin/site-settings" element={
          <PageTransition>
            <ProtectedAdminRoute requireRoles={['edit_site_settings']}><AdminSiteSettingsPage /></ProtectedAdminRoute>
          </PageTransition>
        } />
        <Route path="/admin/users" element={
          <PageTransition>
            <ProtectedAdminRoute requireRoles={['manage_users']}><AdminUsersPage /></ProtectedAdminRoute>
          </PageTransition>
        } />

        {maintenanceMode ? (
          // Bakım modu aktifse => sadece admin sayfaları açık, gerisi kapalı
          <Route path="*" element={<PageTransition><MaintenancePage /></PageTransition>} />
        ) : (
          <>
            {/* Public routes */}
            <Route path="/" element={<PageTransition><MainPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/verify-email" element={<PageTransition><VerifyEmailPage /></PageTransition>} />

            {/* Seller routes */}
            <Route path="/seller/dashboard" element={
              <PageTransition><ProtectedRoute requireSeller><SellerDashboard /></ProtectedRoute></PageTransition>
            } />
            <Route path="/seller/company/create" element={
              <PageTransition><ProtectedRoute requireSeller><CreateCompanyPage /></ProtectedRoute></PageTransition>
            } />
            <Route path="/seller/products/add" element={
              <PageTransition><ProtectedRoute requireSeller><AddProductPage /></ProtectedRoute></PageTransition>
            } />
            <Route path="/seller/products" element={
              <PageTransition><ProtectedRoute requireSeller><SellerProductsPage /></ProtectedRoute></PageTransition>
            } />
            <Route path="/seller/about" element={
              <PageTransition><ProtectedRoute requireSeller><SellerAboutPage /></ProtectedRoute></PageTransition>
            } />
            <Route path="/seller/photos" element={
              <PageTransition><ProtectedRoute requireSeller><SellerPhotosPage /></ProtectedRoute></PageTransition>
            } />
            <Route path="/seller/publish-page" element={
              <PageTransition><ProtectedRoute requireSeller><SellerPublishPage /></ProtectedRoute></PageTransition>
            } />
          <Route
  path="/seller/statistics"
  element={
    <PageTransition>
      <ProtectedRoute requireSeller>
        <SellerStatisticsPage />
      </ProtectedRoute>
    </PageTransition>
  }
/>
            {/* Customer route */}
            <Route path="/customer/home" element={
              <PageTransition><ProtectedRoute requireCustomer><CustomerHome /></ProtectedRoute></PageTransition>
            } />

            {/* Public seller page */}
            <Route path="/:slug" element={<PageTransition><SellerPublicPage /></PageTransition>} />

            {/* 404 */}
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/site-info`)
      .then(res => {
        setMaintenanceMode(res.data.maintenanceMode);
      })
      .catch(() => {
        setMaintenanceMode(false);
      });
  }, []);

  if (maintenanceMode === null) {
    return <Spinner />;
  }

  return (
    <Router>
      <AnimatedRoutes maintenanceMode={maintenanceMode} />

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
