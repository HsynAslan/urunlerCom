import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';

const AdminDashboardPage = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (error) {
        console.error('Admin bilgisi alınamadı:', error);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh',  backgroundColor: 'rgba(249, 250, 251, 0.7)' }}>
      <AdminSidebar />

      <div style={{ 
  width: '80%', 
  marginLeft: '20%', 
  padding: '2rem', 
 
}}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Hoş geldiniz, {admin?.username || 'Yükleniyor...'}
        </h1>
        <p style={{ marginTop: '1rem', color: '#4b5563' }}>
          Admin kontrol paneline erişim sağladınız. Soldaki menüyü kullanarak işlemlerinizi gerçekleştirebilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
