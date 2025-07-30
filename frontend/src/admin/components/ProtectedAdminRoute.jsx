import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedAdminRoute = ({ children, requireRoles = [] }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const roles = res.data.roles || [];
        setUserRoles(roles);

        // Eğer özel bir role gerek yoksa sadece admin olması yeterli
        if (requireRoles.length === 0 || roles.includes('super_admin')) {
          setIsAuthorized(true);
        } else {
          const hasRole = requireRoles.some(role => roles.includes(role));
          setIsAuthorized(hasRole);
        }
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  if (isAuthorized === null) return <div>Yükleniyor...</div>;

  return isAuthorized ? children : <Navigate to="/unauthorized" replace />;
};

export default ProtectedAdminRoute;
