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

           <Route path="/unauthorized" element={<div>Erişim izniniz yok.</div>} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LoadingWrapper>
    </Router>
  );
}

export default App;
