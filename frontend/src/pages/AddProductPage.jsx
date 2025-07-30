import React, { useState } from 'react';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import '../styles/AddProductPage.css';

const currencyOptions = [
  { value: 'TRY', label: 'TL' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
];

const stockUnitOptions = [
  { value: 'adet', label: 'Adet' },
  { value: 'ml', label: 'ml' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' }
];

const AddProductPage = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    priceCurrency: 'TRY',
    stock: '',
    stockUnit: 'adet',
    images: [],
    showcaseImageIndex: 0,
    descriptionSections: [{ title: '', items: [''] }],
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Genel input değişimi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Çoklu açıklama başlığı ve maddeleri için update fonksiyonu
  const handleDescriptionChange = (sectionIndex, field, value, itemIndex = null) => {
    setForm(prev => {
      const newSections = [...prev.descriptionSections];
      if (field === 'title') {
        newSections[sectionIndex].title = value;
      } else if (field === 'item' && itemIndex !== null) {
        newSections[sectionIndex].items[itemIndex] = value;
      }
      return { ...prev, descriptionSections: newSections };
    });
  };

  // Yeni açıklama bölümü ekle
  const addDescriptionSection = () => {
    setForm(prev => ({
      ...prev,
      descriptionSections: [...prev.descriptionSections, { title: '', items: [''] }]
    }));
  };

  // Yeni madde ekle
  const addDescriptionItem = (sectionIndex) => {
    setForm(prev => {
      const newSections = [...prev.descriptionSections];
      newSections[sectionIndex].items.push('');
      return { ...prev, descriptionSections: newSections };
    });
  };

  // Fotoğraf URL'si ekle
  const addImage = () => {
    const url = prompt(t('productAdd.enterPhotoUrl', 'Fotoğraf URL\'si giriniz:'));
    if (url) {
      setForm(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  // Vitrin fotoğrafını seç
  const setShowcaseImage = (index) => {
    setForm(prev => ({ ...prev, showcaseImageIndex: index }));
  };

  // Slug otomatik üret (Türkçe karakterlere dikkat edilmeli)
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');
  };

  // Name değişirken slug otomatik güncellenir
  const onNameChange = (e) => {
    const name = e.target.value;
    setForm(prev => ({ 
      ...prev, 
      name, 
      slug: generateSlug(name) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const postData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/products`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('✅ ' + t('productAdd.success'));
      setSuccess(t('productAdd.success'));
      setForm({
        name: '',
        slug: '',
        price: '',
        priceCurrency: 'TRY',
        stock: '',
        stockUnit: 'adet',
        images: [],
        showcaseImageIndex: 0,
        descriptionSections: [{ title: '', items: [''] }],
      });
    } catch (err) {
      const msg = err.response?.data?.message || t('productAdd.error');
      toast.error('❌ ' + msg);
      setError(msg);
    }
  };

  return (
    <div className="seller-page-layout">
      <div className="seller-sidebar"><SellerSidebar /></div>

      <div className="seller-main-content">
        <div className="language-selector-wrapper">
          <LanguageSelector />
        </div>

        <h1 className="page-title">🆕 {t('productAdd.title')}</h1>

        <form onSubmit={handleSubmit} className="form-box" style={{ maxWidth: '90%', margin: '0 auto' }}>
          <input
            name="name"
            value={form.name}
            onChange={onNameChange}
            placeholder={t('productAdd.name')}
            className="form-input"
            style={{ marginBottom: '10px' }}
            required
          />
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder={t('productAdd.slug')}
            className="form-input"
            style={{ marginBottom: '10px' }}
            required
          />

          <div className="form-row">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder={t('productAdd.price')}
              style={{ marginBottom: '10px', width: '48%', marginRight: '4%' }}
              className="form-input half-width"
              required
            />
            <select
              name="priceCurrency"
              value={form.priceCurrency}
              onChange={handleChange}
              style={{ marginBottom: '10px', width: '48%' }}
              className="form-input half-width"
            >
              {currencyOptions.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              style={{ marginBottom: '10px', width: '48%', marginRight: '4%' }}
              placeholder={t('productAdd.stock')}
              className="form-input half-width"
              required
            />
            <select
              name="stockUnit"
              value={form.stockUnit}
              onChange={handleChange}
              style={{ marginBottom: '10px', width: '48%' }}
              className="form-input half-width"
            >
              {stockUnitOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="images-section">
            <h3>📸 {t('productAdd.photos')}</h3>
            <button type="button" onClick={addImage} className="btn-add-photo">
              ➕ {t('productAdd.addPhoto')}
            </button>
            <div className="images-preview">
              {form.images.length === 0 && <p>{t('productAdd.noPhoto')}</p>}
              {form.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`image-item ${form.showcaseImageIndex === idx ? 'showcase' : ''}`}
                  onClick={() => setShowcaseImage(idx)}
                  title={form.showcaseImageIndex === idx
                    ? t('productAdd.showcasePhoto')
                    : t('productAdd.makeShowcase')}
                >
                  <img src={img} alt={`${t('productAdd.photoAlt')} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="description-sections">
            <h3>📑 {t('productAdd.descriptionSections')}</h3>
            {form.descriptionSections.map((section, sIdx) => (
              <div key={sIdx} className="description-section">
                <input
                  type="text"
                  placeholder={t('productAdd.sectionTitle')}
                  value={section.title}
                  onChange={e => handleDescriptionChange(sIdx, 'title', e.target.value)}
                  className="form-input"
                  required
                />
                {section.items.map((item, iIdx) => (
                  <input
                    key={iIdx}
                    type="text"
                    placeholder={t('productAdd.sectionItem')}
                    value={item}
                    onChange={e => handleDescriptionChange(sIdx, 'item', e.target.value, iIdx)}
                    className="form-input"
                    required
                  />
                ))}
                <button type="button" onClick={() => addDescriptionItem(sIdx)} className="btn-add-item">
                  ➕ {t('productAdd.addItem')}
                </button>
              </div>
            ))}
            <button type="button" onClick={addDescriptionSection} className="btn-add-section">
              ➕ {t('productAdd.addSection')}
            </button>
          </div>

          <button type="submit" className="btn-submit">
            🆕 {t('productAdd.add')}
          </button>
        </form>

        {success && <p className="success-message">✅ {success}</p>}
        {error && <p className="error-message">❌ {error}</p>}
      </div>
    </div>
  );
};

export default AddProductPage;
