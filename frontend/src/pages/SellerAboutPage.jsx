import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/SellerAboutPage.css';
import SellerSidebar from '../components/SellerSidebar';
import 'react-toastify/dist/ReactToastify.css';

const SellerAboutPage = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/sellers/about', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setContent(res.data.content || '');
      })
      .catch((err) => {
        console.error(err);
        toast.error('❌ Veri alınamadı.');
      });
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5000/api/sellers/about',
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('✅ Kaydedildi!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Kaydetme işlemi başarısız.');
    }
  };

  return (
    <div className="seller-layout">
      <div className="seller-sidebar">
        <SellerSidebar />
      </div>
      <div className="seller-content">
        <div className="page-header">
          <span className="emoji">🧾</span>
          <span>Hakkımda</span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="about">
            Hakkınızda yazı
          </label>
          <textarea
            id="about"
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hakkınızda bir şeyler yazın..."
            rows={10}
          />
        </div>

        <button className="form-button" onClick={handleSave}>
          Kaydet
        </button>
      </div>
    </div>
  );
};

export default SellerAboutPage;
