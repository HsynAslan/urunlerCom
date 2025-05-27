import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import { useTranslation } from 'react-i18next';
import Spinner from '../components/Spinner';
import '../styles/SellerProductsPage.css';

const SellerProductsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

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
      } finally {
        setLoading(false);
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

  const handleEditChange = (field, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, editingProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map(p => (p._id === editingProduct._id ? editingProduct : p)));
      setEditingProduct(null);
    } catch (error) {
      alert('Düzenleme işlemi başarısız.');
    }
  };

  if (loading) return <Spinner />;

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
                <button className="edit-btn" onClick={() => setEditingProduct(product)}>
                  {t('productList.edit', 'Düzenle')}
                </button>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                  {t('productList.delete', 'Sil')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingProduct && (
          <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{t('productEdit.title', 'Ürünü Düzenle')}</h2>
              <form onSubmit={handleEditSubmit}>
                <label>
                  {t('productEdit.name', 'Ürün Adı')}:
                  <input type="text" value={editingProduct.name} onChange={(e) => handleEditChange('name', e.target.value)} required />
                </label>
                <label>
                  {t('productEdit.price', 'Fiyat')}:
                  <input type="number" value={editingProduct.price} onChange={(e) => handleEditChange('price', Number(e.target.value))} required />
                </label>
                <label>
                  {t('productEdit.priceCurrency', 'Para Birimi')}:
                  <input type="text" value={editingProduct.priceCurrency || 'TRY'} onChange={(e) => handleEditChange('priceCurrency', e.target.value)} required />
                </label>
                <label>
                  {t('productEdit.stock', 'Stok')}:
                  <input type="number" value={editingProduct.stock} onChange={(e) => handleEditChange('stock', Number(e.target.value))} required />
                </label>
                <label>
                  {t('productEdit.stockUnit', 'Stok Birimi')}:
                  <input type="text" value={editingProduct.stockUnit} onChange={(e) => handleEditChange('stockUnit', e.target.value)} required />
                </label>
                <label>
                  {t('productEdit.description', 'Açıklamalar')}:
                  <textarea value={editingProduct.descriptionSections?.join('\n')} onChange={(e) => handleEditChange('descriptionSections', e.target.value.split('\n'))} rows={4} />
                </label>
                <label>
                  {t('productEdit.images', 'Görseller (virgülle ayır)')}:
                  <input type="text" value={editingProduct.images?.join(',')} onChange={(e) => handleEditChange('images', e.target.value.split(','))} />
                </label>
                <label>
                  {t('productEdit.showcaseImageIndex', 'Vitrin Görseli İndeksi')}:
                  <input type="number" value={editingProduct.showcaseImageIndex || 0} onChange={(e) => handleEditChange('showcaseImageIndex', Number(e.target.value))} />
                </label>

                <div className="modal-actions">
                  <button type="submit">{t('productEdit.save', 'Kaydet')}</button>
                  <button type="button" onClick={() => setEditingProduct(null)}>{t('productEdit.cancel', 'İptal')}</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SellerProductsPage;
