import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import '../styles/CreateCompanyPage.css';

const CreateCompanyPage = () => {
  const { t } = useTranslation();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slugError, setSlugError] = useState(null);
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    companyName: '',
    slug: '',
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
        const { data } = await axios.get('http://localhost:5000/api/sellers/store', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSellerInfo(data);
        setForm({
          companyName: data.companyName || '',
          slug: data.slug || '',
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
        console.error('Seller fetch error:', err);
      }
    };
    fetchSeller();
  }, [token]);

  // Slug kontrolü backend'de
  const checkSlug = useCallback(async (slugValue) => {
    if (!slugValue) {
      setSlugError(null);
      return;
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(slugValue)) {
      setSlugError('Slug sadece harf, rakam, - ve _ içerebilir.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/sellers/check-slug', { slug: slugValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Eğer slug mevcut ve bu satıcıya ait değilse hata
      if (res.data.exists && res.data.exists !== sellerInfo?._id) {
        setSlugError('Bu slug zaten kullanılıyor.');
      } else {
        setSlugError(null);
      }
    } catch (err) {
      console.error('Slug kontrol hatası:', err);
      setSlugError('Slug kontrolü yapılamadı.');
    }
  }, [token, sellerInfo]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === 'slug') {
      setForm(prev => ({ ...prev, slug: value }));
      checkSlug(value);
      return;
    }

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
    if (slugError) {
      alert('Lütfen slug alanındaki hatayı düzeltin.');
      return;
    }

    try {
      const { data } = await axios.put('http://localhost:5000/api/sellers/update', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSellerInfo(data);
      setShowModal(false);
      alert('Bilgiler kaydedildi.');
    } catch (err) {
      console.error('Save error:', err);
      alert('Kaydetme sırasında hata oluştu.');
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
            <p><span className="company-info-label">{t('sellerCreateCompany.slug', 'Sayfa URL\'si (slug)')}:</span> {sellerInfo.slug || '-'}</p>
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

              <input
                type="text"
                name="slug"
                placeholder={t('sellerCreateCompany.slug', 'Sayfa URL\'si (slug)')}
                value={form.slug}
                onChange={handleInput}
                className="modal-input"
              />
              {slugError && <p style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{slugError}</p>}

              {['phone', 'email', 'address', 'website', 'location', 'instagram'].map(field => (
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
                <button className="save-button" onClick={handleSave} disabled={!!slugError}>
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
