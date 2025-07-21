import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Spinner from './components/Spinner';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage'; 
import SellerDashboard from './pages/SellerDashboard'; 
import CustomerHome from './pages/CustomerHome'; 
import ProtectedRoute from './components/ProtectedRoute';
import CreateCompanyPage from './pages/CreateCompanyPage';
import AddProductPage from './pages/AddProductPage';
import SellerProductsPage from './pages/SellerProductsPage';
import AdminLogin from './admin/panel/AdminLogin';
import AdminDashboardPage from './admin/panel/AdminDashboardPage';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import CreateSubAdminPage from './admin/panel/CreateSubAdminPage';
import AdminSiteSettingsPage from './admin/panel/AdminSiteSettingsPage';
import AdminUsersPage from './admin/panel/AdminUsers';
import SellerAboutPage from './pages/SellerAboutPage';
import SellerPhotosPage from './pages/SellerPhotosPage';
import SellerPublishPage from './pages/SellerPublishPage';
import AdminThemePage from './admin/panel/AdminThemePage';
import SellerPublicPage from './pages/SellerPublicPage';
function LoadingWrapper({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sayfa değişimi algılandı
    setLoading(true);

    // En az 500ms spinner göster, sonra kapat
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [location.pathname]); // Yolu dinle

  if (loading) {
    return <Spinner />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <LoadingWrapper>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          
              <Route path="/seller/dashboard" element={<ProtectedRoute requireSeller><SellerDashboard /></ProtectedRoute>}/>
          <Route
          path="/customer/home"
          element={
            <ProtectedRoute requireCustomer>
              <CustomerHome />
            </ProtectedRoute>
          }
        />
          <Route
  path="/seller/company/create"
  element={
    <ProtectedRoute requireSeller>
      <CreateCompanyPage />
    </ProtectedRoute>
  }
/>
<Route path="/seller/products/add" element={
  <ProtectedRoute requireSeller>
    <AddProductPage />
  </ProtectedRoute>
} />
<Route
  path="/seller/publish-page"
  element={
    <ProtectedRoute requireSeller>
      <SellerPublishPage />
    </ProtectedRoute>
  }
/>


          <Route path="/seller/products" element={
            <ProtectedRoute requireSeller>
              <SellerProductsPage />
            </ProtectedRoute>
          } />

<Route
  path="/admin/dashboard"
  element={
    <ProtectedAdminRoute>
      <AdminDashboardPage />
    </ProtectedAdminRoute>
  }
/>


  
  <Route path="/seller/:slug" element={<SellerPublicPage />} />




<Route
  path="/admin/theme"
  element={
    <ProtectedAdminRoute requireRoles={['edit_theme']}>
      <AdminThemePage />
    </ProtectedAdminRoute>
  }
/>


 <Route path="/admin/subadmin" element={
      <ProtectedAdminRoute requireRoles={['super_admin']}>
        <CreateSubAdminPage />
      </ProtectedAdminRoute>
    } />


<Route
  path="/admin/site-settings"
  element={
    <ProtectedAdminRoute requireRoles={['edit_site_settings']}>
      <AdminSiteSettingsPage />
    </ProtectedAdminRoute>
  }
/>


<Route
  path="/admin/users"
  element={
    <ProtectedAdminRoute requireRoles={['manage_users']}>
      <AdminUsersPage />
    </ProtectedAdminRoute>
  }
/>

<Route path="/seller/about" element={<ProtectedRoute requireSeller><SellerAboutPage /></ProtectedRoute>} />
<Route path="/seller/photos" element={<ProtectedRoute requireSeller><SellerPhotosPage /></ProtectedRoute>} />

 <Route path="/admin/login" element={<AdminLogin />} />
  {/* <Route path="/admin/panel" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} /> */}
           <Route path="/unauthorized" element={<div>Erişim izniniz yok.</div>} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LoadingWrapper>
    </Router>
  );
}

export default App;
