import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import { useTranslation } from 'react-i18next';
import '../styles/SellerProductsPage.css';

const SellerProductsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/products/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(data);
    } catch (err) {
      setError('Ürünler alınamadı.');
    }
  };
  fetchProducts();
}, []);


  const handleDelete = async (id) => {
    if (!window.confirm(t('productList.confirmDelete', 'Bu ürünü silmek istediğinize emin misiniz?'))) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div className="page-container">
      <div className="sidebar"><SellerSidebar /></div>
      <div className="content">
        <h1>{t('productList.title', 'Ürünlerim')}</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img src={product.images[product.showcaseImageIndex || 0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price} {product.priceCurrency || '₺'}</p>
              <p>{product.stock} {product.stockUnit}</p>
              <div className="actions">
                <button className="edit-btn">{t('productList.edit', 'Düzenle')}</button>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                  {t('productList.delete', 'Sil')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProductsPage;
