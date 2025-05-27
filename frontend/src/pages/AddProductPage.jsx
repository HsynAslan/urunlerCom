import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import '../styles/AddProductPage.css'; 
const AddProductPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/products', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(t('productAdd.success', 'Ürün başarıyla eklendi.'));
      setForm({ name: '', slug: '', description: '', price: '', stock: '' });
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
    <div className="language-selector">
      <LanguageSelector />
    </div>

    <h1 className="page-title">{t('productAdd.title', 'Yeni Ürün Ekle')}</h1>

    <form onSubmit={handleSubmit} className="form-box">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
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
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder={t('productAdd.description', 'Açıklama')}
        className="form-textarea"
      />
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder={t('productAdd.price', 'Fiyat')}
        className="form-input"
        required
      />
      <input
        type="number"
        name="stock"
        value={form.stock}
        onChange={handleChange}
        placeholder={t('productAdd.stock', 'Stok')}
        className="form-input"
      />

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
