import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/SellerSidebar.css';

const SellerSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [seller, setSeller] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null); // dropdown kontrolü

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (key) => {
    setOpenDropdown(prev => (prev === key ? null : key));
  };

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
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-2 z-[10000] bg-blue-600 text-white p-1 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="p-4 flex items-center justify-between border-b border-white">
          <h2 className="text-lg font-semibold">
            {seller?.user?.name || 'Yükleniyor...'}
          </h2>

          {isOpen && (
            <button
              onClick={toggleSidebar}
              className="text-white ml-2 bg-blue-500 p-1 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        <div className="p-4">
          {/* Mağaza Dropdown */}
          <div className="section">
            <div className="section-header" onClick={() => toggleDropdown('store')}>
              Mağaza
            </div>
            <div className={`section-items ${openDropdown === 'store' ? 'open' : ''}`}>
              <button className="hover:underline text-left">Mağaza Oluştur</button>
              <button className="hover:underline text-left">Ürün Düzenleme</button>
            </div>
          </div>

          {/* Şirket Dropdown */}
          <div className="section">
            <div className="section-header" onClick={() => toggleDropdown('company')}>
              Şirket
            </div>
            <div className={`section-items ${openDropdown === 'company' ? 'open' : ''}`}>
              <button className="hover:underline text-left">1</button>
              <button className="hover:underline text-left">2</button>
              <button className="hover:underline text-left">3</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;
