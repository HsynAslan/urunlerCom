import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import '../styles/CreateCompanyPage.css';
import { toast } from 'react-toastify';

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
        toast.error('Şirket bilgileri alınırken hata oluştu ⚠️');
      }
    };
    fetchSeller();
  }, [token]);

  const normalizeSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '')
      .replace(/-+/g, '-');
  };

  const checkSlug = useCallback(async (slugValue) => {
    if (!slugValue) {
      setSlugError(null);
      return;
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(slugValue)) {
      showSlugError('Slug sadece harf, rakam, - ve _ içerebilir ❗');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/sellers/check-slug', { slug: slugValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.exists && res.data.exists !== sellerInfo?._id) {
        toast.error('Bu slug zaten kullanılıyor 🚫');
        setSlugError('Slug zaten kullanılıyor.');
      } else {
        setSlugError(null);
      }
    } catch (err) {
      console.error('Slug kontrol hatası:', err);
      toast.error('Slug kontrolü yapılamadı ⚠️');
      showSlugError('Slug kontrolü yapılamadı.');
    }
  }, [token, sellerInfo]);

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === 'slug') {
      const cleanedSlug = normalizeSlug(value);
      setForm(prev => ({ ...prev, slug: cleanedSlug }));

      if (value !== cleanedSlug) {
        setSlugError('Slug otomatik olarak düzeltildi 🛠️');
        toast.info('Slug geçersiz karakterler içeriyordu, düzeltildi ✏️');
      } else {
        setSlugError(null);
      }

      checkSlug(cleanedSlug);
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

  const showSlugError = (msg) => {
    setSlugError(msg);
    setTimeout(() => {
      setSlugError(null);
    }, 4000);
  };

  const handleSave = async () => {
    if (slugError) {
      toast.error('Lütfen slug alanındaki hatayı düzeltin ❌');
      return;
    }

    try {
      const { data } = await axios.put('http://localhost:5000/api/sellers/update', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSellerInfo(data);
      setShowModal(false);
      toast.success('Bilgiler başarıyla kaydedildi ✅');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Kaydetme sırasında hata oluştu ❌');
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

        <h1 className="page-title-header">
          <span role="img" aria-label="office">🏢</span>
          {t('sellerCreateCompany.title', 'Şirket Oluştur veya Düzenle')}
        </h1>

        {sellerInfo ? (
          <div className="company-info-box">
            <p><span className="company-info-label">📛 {t('sellerCreateCompany.companyName', 'Şirket Adı')}:</span> {sellerInfo.companyName || '-'}</p>
            <p><span className="company-info-label">🔗 {t('sellerCreateCompany.slug', 'Sayfa URL\'si')}:</span> {sellerInfo.slug || '-'}</p>
            <p><span className="company-info-label">📞 {t('sellerCreateCompany.phone', 'Telefon')}:</span> {sellerInfo.contactInfo?.phone || '-'}</p>
            <p><span className="company-info-label">📧 {t('sellerCreateCompany.email', 'Email')}:</span> {sellerInfo.contactInfo?.email || '-'}</p>
            <button className="edit-button" onClick={() => setShowModal(true)}>
              ✏️ {t('sellerCreateCompany.edit', 'Düzenle')}
            </button>
          </div>
        ) : (
          <p>⏳ {t('sellerCreateCompany.loading', 'Yükleniyor...')}</p>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">📝 {t('sellerCreateCompany.editCompany', 'Şirket Bilgilerini Düzenle')}</h2>

              <input type="text" name="companyName" placeholder="Şirket Adı" value={form.companyName} onChange={handleInput} className="modal-input" />
              <input type="text" name="slug" placeholder="Slug (sayfa URL'si)" value={form.slug} onChange={handleInput} className="modal-input" />
              {slugError && <p style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{slugError}</p>}

              {['phone', 'email', 'address', 'website', 'location', 'instagram'].map(field => (
                <input key={field} type="text" name={field} placeholder={t(`sellerCreateCompany.${field}`, field)} value={form.contactInfo[field]} onChange={handleInput} className="modal-input" />
              ))}

              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowModal(false)}>❌ {t('sellerCreateCompany.cancel', 'İptal')}</button>
                <button className="save-button" onClick={handleSave} disabled={!!slugError}>💾 {t('sellerCreateCompany.save', 'Kaydet')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCompanyPage;
