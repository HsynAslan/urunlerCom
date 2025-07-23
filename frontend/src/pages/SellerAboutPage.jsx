import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import '../styles/SellerAboutPage.css';
import SellerSidebar from '../components/SellerSidebar';
import 'react-toastify/dist/ReactToastify.css';
import LanguageSelector from '../components/LanguageSelector';

const SellerAboutPage = () => {
  const { t } = useTranslation();
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
        toast.error('❌ ' + t('sellerAbout.fetchError'));
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
      toast.success('✅ ' + t('sellerAbout.success'));
    } catch (err) {
      console.error(err);
      toast.error('❌ ' + t('sellerAbout.saveError'));
    }
  };

  return (
    <div className="seller-layout">
      <div className="seller-sidebar">
        <SellerSidebar />
      </div>
       <div className="language-selector-container">
          <LanguageSelector />
        </div>
      <div className="seller-content">
        <div className="page-header">
          <span className="emoji">🧾</span>
          <span>{t('sellerAbout.title')}</span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="about">
            {t('sellerAbout.textLabel')}
          </label>
          <textarea
            id="about"
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('sellerAbout.placeholder')}
            rows={10}
          />
        </div>

        <button className="form-button" onClick={handleSave}>
          {t('sellerAbout.save')}
        </button>
      </div>
    </div>
  );
};

export default SellerAboutPage;
