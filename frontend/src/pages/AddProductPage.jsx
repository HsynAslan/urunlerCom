import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
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
    images: [], // string[] (URL)
    showcaseImageIndex: 0,
    descriptionSections: [
      { title: '', items: [''] } // başlangıçta 1 başlık + 1 madde
    ],
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
    const newSections = [...prev.descriptionSections]; // bölümleri kopyala
    const updatedItems = [...newSections[sectionIndex].items, '']; // madde dizisini kopyala ve bir madde ekle

    newSections[sectionIndex] = {
      ...newSections[sectionIndex], // diğer özellikleri koru
      items: updatedItems, // sadece yeni items dizisini koy
    };

    return { ...prev, descriptionSections: newSections };
  });
};

  // Fotoğraf URL'si ekle (basit örnek, gerçek kullanımda upload yapılmalı)
  const addImage = () => {
    const url = prompt('Fotoğraf URL\'si giriniz:');
    if (url) {
      setForm(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  // Vitrin fotoğrafını seç
  const setShowcaseImage = (index) => {
    setForm(prev => ({ ...prev, showcaseImageIndex: index }));
  };

  // Slug otomatik üret (örnek basit, Türkçe karakterlere dikkat edilmeli)
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
      // API'ye gönderilecek veri
      const postData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      const { data } = await axios.post('http://localhost:5000/api/products', postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(t('productAdd.success', 'Ürün başarıyla eklendi.'));
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
      setError(err.response?.data?.message || t('productAdd.error', 'Ürün eklenirken hata oluştu.'));
    }
  };

  return (
    <div className="page-container">
      <div className="sidebar">
        <SellerSidebar />
      </div>

      <div className="content">
        <div className="language-selector-container">
          <LanguageSelector />
        </div>

        <h1 className="page-title">{t('productAdd.title', 'Yeni Ürün Ekle')}</h1>

        <form onSubmit={handleSubmit} className="form-box">
          <input
            name="name"
            value={form.name}
            onChange={onNameChange}
            placeholder={t('productAdd.name', 'Ürün Adı')}
            className="form-input"
            required
          />
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder={t('productAdd.slug', 'Slug')}
            className="form-input"
            required
          />

          <div className="form-row">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder={t('productAdd.price', 'Fiyat')}
              className="form-input half-width"
              required
            />
            <select
              name="priceCurrency"
              value={form.priceCurrency}
              onChange={handleChange}
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
              placeholder={t('productAdd.stock', 'Stok')}
              className="form-input half-width"
            />
            <select
              name="stockUnit"
              value={form.stockUnit}
              onChange={handleChange}
              className="form-input half-width"
            >
              {stockUnitOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

        {/* Fotoğraflar */}
<div className="images-section">
  <h3>{t('productAdd.photos', 'Fotoğraflar')}</h3>
  <button type="button" onClick={addImage} className="small-button">
    {t('productAdd.addPhoto', 'Fotoğraf Ekle')}
  </button>
  <div className="images-preview">
    {form.images.length === 0 && <p>{t('productAdd.noPhoto', 'Henüz fotoğraf yok.')}</p>}
    {form.images.map((img, idx) => (
      <div
        key={idx}
        className={`image-item ${form.showcaseImageIndex === idx ? 'showcase' : ''}`}
        onClick={() => setShowcaseImage(idx)}
        title={
          form.showcaseImageIndex === idx
            ? t('productAdd.showcasePhoto', 'Vitrin Fotoğrafı')
            : t('productAdd.makeShowcase', 'Vitrin fotoğrafı yap')
        }
      >
        <img src={img} alt={`${t('productAdd.photoAlt', 'Ürün fotoğrafı')} ${idx + 1}`} />
      </div>
    ))}
  </div>
</div>

{/* Açıklama bölümleri */}
<div className="description-sections">
  <h3>{t('productAdd.descriptionSections', 'Açıklama Bölümleri')}</h3>
  {form.descriptionSections.map((section, sIdx) => (
    <div key={sIdx} className="description-section">
      <input
        type="text"
        placeholder={t('productAdd.sectionTitle', 'Başlık')}
        value={section.title}
        onChange={e => handleDescriptionChange(sIdx, 'title', e.target.value)}
        className="form-input"
        required
      />
      {section.items.map((item, iIdx) => (
        <input
          key={iIdx}
          type="text"
          placeholder={t('productAdd.sectionItem', 'Madde')}
          value={item}
          onChange={e => handleDescriptionChange(sIdx, 'item', e.target.value, iIdx)}
          className="form-input"
          required
        />
      ))}
      <button type="button" onClick={() => addDescriptionItem(sIdx)} className="small-button">
        {t('productAdd.addItem', 'Madde Ekle')}
      </button>
    </div>
  ))}
  <button type="button" onClick={addDescriptionSection} className="small-button add-section-button">
    {t('productAdd.addSection', 'Yeni Bölüm Ekle')}
  </button>
</div>


          <button type="submit" className="submit-button">
            {t('productAdd.add', 'Ekle')}
          </button>
        </form>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AddProductPage;
