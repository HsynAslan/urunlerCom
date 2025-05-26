import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronLeft, ChevronRight, Building2, PackagePlus,
  BarChart3, Store, CheckCircle, CircleDollarSign
} from 'lucide-react';
import '../styles/SellerSidebar.css';

const SellerSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (key) => setOpenDropdown(prev => (prev === key ? null : key));

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/sellers/store', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSeller(res.data);
      } catch (error) {
        console.error('Sidebar seller fetch error:', error);
      }
    };
    fetchSeller();
  }, []);

  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <ChevronRight size={20} />
        </button>
      )}

      <div className={`seller-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <span>{seller?.user?.name || 'Yükleniyor...'}</span>
          <button onClick={toggleSidebar} className="toggle-button">
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Mağaza */}
          <div className="sidebar-section">
            <div className="section-header" onClick={() => toggleDropdown('store')}>
              <Store size={18} /> <span className='bigger-icon'>Mağaza</span>
            </div>
            {openDropdown === 'store' && (
              <div className="section-items">
                <button  onClick={() => navigate('/seller/company/create')}>
                  <Building2 size={20} /> <span className='bigger-icon'>Şirketini Oluştur</span>
                </button>
                <button onClick={() => navigate('/seller/company/info')}>
                  <Building2 size={16} /> Şirket Bilgileri
                </button>
                <button onClick={() => navigate('/seller/products/add')}>
                  <PackagePlus size={16} /> Ürün Ekle
                </button>
                <button onClick={() => navigate('/seller/products')}>
                  <PackagePlus size={16} /> Ürünleri Düzenle
                </button>
              </div>
            )}
          </div>

          {/* İstatistikler */}
          <div className="sidebar-section">
            <button className="section-header" onClick={() => navigate('/seller/statistics')}>
              <BarChart3 size={18} /> <span>Şirket İstatistikleri</span>
            </button>
          </div>

          {/* Planlar */}
          <div className="sidebar-section">
            <div className="section-header" onClick={() => toggleDropdown('plans')}>
              <CircleDollarSign size={18} /> <span>Planlar</span>
            </div>
            {openDropdown === 'plans' && (
              <div className="section-items">
                <button onClick={() => navigate('/seller/plans/free')}>
                  <CheckCircle size={16} /> Free Plan
                </button>
                <button onClick={() => navigate('/seller/plans/premium')}>
                  <CheckCircle size={16} /> Premium Plan
                </button>
                <button onClick={() => navigate('/seller/plans/business')}>
                  <CheckCircle size={16} /> Business Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;
