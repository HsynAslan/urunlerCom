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
          <div className="sidebar-section marginBott1em">
            <div className="section-header marginBott1em" onClick={() => toggleDropdown('store')}>
              <Store size={25} /> <span className='bigger-icon'>Mağaza</span>
            </div>
            {openDropdown === 'store' && (
              <div className="section-items">
                <button  onClick={() => navigate('/seller/company/create')} className='marginBott1em'>
                  <Building2 size={20} /> <span className='bigger-icon'>Şirketini Oluştur</span>
                </button>
                <button onClick={() => navigate('/seller/company/info')} className='marginBott1em'>
                  <Building2 size={20} /> <span className='bigger-icon'>Şirket Bilgileri</span>
                </button>
                <button onClick={() => navigate('/seller/products/add')} className='marginBott1em'>
                  <PackagePlus size={20} /> <span className='bigger-icon'>Ürün Ekle</span>
                </button>
                <button onClick={() => navigate('/seller/products')}>
                  <PackagePlus size={20} /> <span className='bigger-icon' >Ürünleri Düzenle</span>
                </button>
              </div>
            )}
          </div>

            <div className="section-header marginBott1em" onClick={() => navigate('/seller/statistics')}>
              <Store size={25} /> <span className='bigger-icon'>Şirket İstatistikleri</span>
            </div>

          {/* Planlar */}
          <div className="marginBott1em">
            <div className="section-header marginBott1em" onClick={() => toggleDropdown('plans')}>
              <CircleDollarSign size={25} /> <span>Planlar</span>
            </div>
            {openDropdown === 'plans' && (
              <div className="section-items">
                <button onClick={() => navigate('/seller/plans/free')} className='marginBott1em'>
                  <CheckCircle size={20} /> <span className='bigger-icon'>Free Plan</span>
                </button>
                <button onClick={() => navigate('/seller/plans/premium')} className='marginBott1em'>
                  <CheckCircle size={20} /> <span className='bigger-icon'>Premium Plan</span>
                </button>
                <button onClick={() => navigate('/seller/plans/business')} className='marginBott1em'>
                  <CheckCircle size={20} /> <span className='bigger-icon'>Business Plan</span>
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
