import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft, ChevronRight, Building2, PackagePlus,
  BarChart3, Store, CheckCircle, CircleDollarSign
} from 'lucide-react';
import '../styles/SellerSidebar.css';

const SellerSidebar = () => {
   const { t } = useTranslation();
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
const handleLogout = () => {
  localStorage.removeItem('token');  // Token'ı temizle
  navigate('/login');           // Giriş sayfasına yönlendir
};
  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <ChevronRight size={20} />
        </button>
      )}

      <div className={`seller-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <span>{seller?.user?.name || 'Loading...'}</span>
          <button onClick={toggleSidebar} className="toggle-button">
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Mağaza */}
          <div className="sidebar-section marginBott1em">
            <div className="section-header marginBott1em" onClick={() => toggleDropdown('store')}>
              <Store size={25} /> <span className='bigger-icon'>{t('sellerSidebar.store')}</span>
            </div>
            {openDropdown === 'store' && (
              <div className="section-items">
                <button  onClick={() => navigate('/seller/company/create')} className='marginBott1em'>
                  <Building2 size={20} /> <span className='bigger-icon'>{t('sellerSidebar.createCompany')}</span>
                </button>
                {/* <button onClick={() => navigate('/seller/company/info')} className='marginBott1em'>
                  <Building2 size={20} /> <span className='bigger-icon'>{t('sellerSidebar.companyInfo')}</span>
                </button> */}
                <button onClick={() => navigate('/seller/products/add')} className='marginBott1em'>
                  <PackagePlus size={20} /> <span className='bigger-icon'>{t('sellerSidebar.addProduct')}</span>
                </button>

                <button onClick={() => navigate('/seller/products')} className='marginBott1em'>
                  <PackagePlus size={20} /> <span className='bigger-icon' >{t('sellerSidebar.editProducts')}</span>
                </button>

                <button onClick={() => navigate('/seller/about')} className='marginBott1em'>
                  <BarChart3 size={20} /> <span className='bigger-icon'>Hakkımda Sayfası</span>
                </button>
                <button onClick={() => navigate('/seller/photos')} className='marginBott1em'>
                  <BarChart3 size={20} /> <span className='bigger-icon'>Fotoğraf Galerisi</span>
                </button>

              </div>
            )}
          </div>

            <div className="section-header marginBott1em" onClick={() => navigate('/seller/statistics')}>
              <Store size={25} /> <span className='bigger-icon'>{t('sellerSidebar.statistics')}</span>
            </div>

          {/* Planlar */}
          <div className="marginBott1em">
            <div className="section-header marginBott1em" onClick={() => toggleDropdown('plans')}>
              <CircleDollarSign size={25} /> <span>{t('sellerSidebar.plans')}</span>
            </div>
            {openDropdown === 'plans' && (
              <div className="section-items">
                <button onClick={() => navigate('/seller/plans/free')} className='marginBott1em'>
                  <CheckCircle size={20} /> <span className='bigger-icon'>{t('sellerSidebar.freePlan')}</span>
                </button>
                <button onClick={() => navigate('/seller/plans/premium')} className='marginBott1em'>
                  <CheckCircle size={20} /> <span className='bigger-icon'>{t('sellerSidebar.premiumPlan')}</span>
                </button>
                <button onClick={() => navigate('/seller/plans/business')} className='marginBott1em'>
                  <CheckCircle size={20} /> <span className='bigger-icon'>{t('sellerSidebar.businessPlan')}</span>
                </button>
              </div>
            )}
          </div>
           <button onClick={handleLogout} className="logout-button marginTopAuto">
  Çıkış Yap
</button>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;
