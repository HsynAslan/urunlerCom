import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import '../styles/CreateCompanyPage.css'; // 👈 CSS dosyasını içeri al

const CreateCompanyPage = () => {
  const { t } = useTranslation();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      website: '',
      location: '',
      instagram: '',
    }
  });

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/sellers/store', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
        setSellerInfo(data);
        setForm({
          companyName: data.companyName || '',
          contactInfo: {
            phone: data.contactInfo?.phone || '',
            email: data.contactInfo?.email || '',
            address: data.contactInfo?.address || '',
            website: data.contactInfo?.website || '',
            location: data.contactInfo?.location || '',
            instagram: data.contactInfo?.instagram || '',
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchSeller();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name in form.contactInfo) {
      setForm(prev => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [name]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
        const token = localStorage.getItem('token');
    const { data } = await axios.put(
  'http://localhost:5000/api/sellers/update',
  form,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
      setSellerInfo(data);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-company-container">
      <div className="create-company-sidebar">
        <SellerSidebar />
      </div>

      <div className="create-company-content">
        <div className="language-selector-container">
          <LanguageSelector />
        </div>

        <h1 className="company-title">
          {t('sellerCreateCompany.title', 'Şirket Oluştur veya Düzenle')}
        </h1>

        {sellerInfo ? (
          <div className="company-info-box">
            <p><span className="company-info-label">{t('sellerCreateCompany.companyName', 'Şirket Adı')}:</span> {sellerInfo.companyName || '-'}</p>
            <p><span className="company-info-label">{t('sellerCreateCompany.phone', 'Telefon')}:</span> {sellerInfo.contactInfo?.phone || '-'}</p>
            <p><span className="company-info-label">{t('sellerCreateCompany.email', 'Email')}:</span> {sellerInfo.contactInfo?.email || '-'}</p>
            <button className="edit-button" onClick={() => setShowModal(true)}>
              {t('sellerCreateCompany.edit', 'Düzenle')}
            </button>
          </div>
        ) : (
          <p>{t('sellerCreateCompany.loading', 'Yükleniyor...')}</p>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">
                {t('sellerCreateCompany.editCompany', 'Şirket Bilgilerini Düzenle')}
              </h2>

              <input
                type="text"
                name="companyName"
                placeholder={t('sellerCreateCompany.companyName', 'Şirket Adı')}
                value={form.companyName}
                onChange={handleInput}
                className="modal-input"
              />
              {['phone', 'email', 'address', 'website', 'location', 'instagram'].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={t(`sellerCreateCompany.${field}`)}
                  value={form.contactInfo[field]}
                  onChange={handleInput}
                  className="modal-input"
                />
              ))}

              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowModal(false)}>
                  {t('sellerCreateCompany.cancel', 'İptal')}
                </button>
                <button className="save-button" onClick={handleSave}>
                  {t('sellerCreateCompany.save', 'Kaydet')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCompanyPage;
