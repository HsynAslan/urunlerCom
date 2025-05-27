import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, Eye, Users, FileCheck, UserPlus, Palette } from 'lucide-react';
import axios from 'axios';
import '../css/AdminSidebar.css';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admins/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(res.data);
      } catch (error) {
        console.error('Admin fetch failed:', error);
      }
    };
    fetchAdmin();
  }, []);

  const hasRole = (role) => admin?.roles?.includes(role);

  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <ChevronRight size={20} />
        </button>
      )}
      <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <span>{admin?.username || 'Admin'}</span>
          <button onClick={toggleSidebar} className="toggle-button">
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {hasRole('edit_site_settings') && (
            <button onClick={() => navigate('/admin/site-settings')} className="marginBott1em">
              <Settings size={20} /> Site Ayarları
            </button>
          )}
          {hasRole('edit_theme') && (
            <button onClick={() => navigate('/admin/theme')} className="marginBott1em">
              <Palette size={20} /> Tema Ayarları
            </button>
          )}
          {hasRole('view_everything') && (
            <button onClick={() => navigate('/admin/overview')} className="marginBott1em">
              <Eye size={20} /> Genel Görünüm
            </button>
          )}
          {hasRole('manage_users') && (
            <button onClick={() => navigate('/admin/users')} className="marginBott1em">
              <Users size={20} /> Kullanıcı Yönetimi
            </button>
          )}
          {hasRole('check_products') && (
            <button onClick={() => navigate('/admin/products/review')} className="marginBott1em">
              <FileCheck size={20} /> Ürün İnceleme
            </button>
          )}
          {hasRole('manage_admins') && (
            <button onClick={() => navigate('/admin/manage-admins')} className="marginBott1em">
              <UserPlus size={20} /> Alt Adminler
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
