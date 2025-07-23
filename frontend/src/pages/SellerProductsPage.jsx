import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';

import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/SellerProductsPage.css'; // Assuming you have a CSS file for styling
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
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
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(data);
        
      } catch (err) {
        setError(t('productList.loadError'));
        toast.error('❌ Ürünler alınırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('productList.confirmDelete'))) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(p => p._id !== id));
      toast.success('🗑️ Ürün silindi');
    } catch (err) {
      toast.error('❌ Silme işlemi başarısız');
    }
  };

  const handleEditChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, editingProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.map(p => (p._id === editingProduct._id ? editingProduct : p)));
      setEditingProduct(null);
      toast.success('✅ Ürün güncellendi');
    } catch (error) {
      toast.error('❌ Düzenleme başarısız');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="seller-page-layout">
      <div className="seller-sidebar"><SellerSidebar /></div>
 <div className="language-selector-container">
          <LanguageSelector />
        </div>
      <div className="seller-main-content">
        <h1 className="seller-title">📦 {t('productList.title')}</h1>

        {error && <p className="seller-error-message">{error}</p>}

        <div className="seller-products-grid">
          {products.map(product => (
            <div key={product._id} className="seller-product-card">
              <img src={product.images[product.showcaseImageIndex || 0]} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">💸 {product.price} {product.priceCurrency || '₺'}</p>
              <p className="product-stock">📦 {product.stock} {product.stockUnit}</p>
              <div className="product-actions">
                <button className="btn-edit" onClick={() => setEditingProduct(product)}>✏️ {t('productList.edit')}</button>
                <button className="btn-delete" onClick={() => handleDelete(product._id)}>🗑️ {t('productList.delete')}</button>
              </div>
            </div>
          ))}
        </div>

        {editingProduct && (
          <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
            <div className="modal-edit" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">🛠️ {t('productEdit.title')}</h2>
              <form onSubmit={handleEditSubmit} className="edit-form">

                <label className="form-label">
                  {t('productEdit.name')}:
                  <input type="text" value={editingProduct.name} onChange={(e) => handleEditChange('name', e.target.value)} required />
                </label>

                <label className="form-label">
                  {t('productEdit.price')}:
                  <input type="number" className='widthFill' value={editingProduct.price} onChange={(e) => handleEditChange('price', Number(e.target.value))} required />
                </label>

                <label className="form-label">
                  {t('productEdit.priceCurrency')}:
                  <input type="text" value={editingProduct.priceCurrency || 'TRY'} onChange={(e) => handleEditChange('priceCurrency', e.target.value)} required />
                </label>

                <label className="form-label">
                  {t('productEdit.stock')}:
                  <input type="number" className='widthFill' value={editingProduct.stock} onChange={(e) => handleEditChange('stock', Number(e.target.value))} required />
                </label>

                <label className="form-label">
                  {t('productEdit.stockUnit')}:
                  <input type="text" value={editingProduct.stockUnit} onChange={(e) => handleEditChange('stockUnit', e.target.value)} required />
                </label>

                <div className="product-description-sections">
                  <h3>📑 {t('productEdit.descriptionSections')}</h3>

                  {(editingProduct.descriptionSections || []).map((section, sectionIndex) => (
                    <div key={sectionIndex} className="desc-section">
                      <label>
                        {t('productEdit.sectionTitle')}:
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...editingProduct.descriptionSections];
                            updated[sectionIndex].title = e.target.value;
                            handleEditChange('descriptionSections', updated);
                          }}
                        />
                      </label>

                      <div className="section-items">
                        <label>{t('productEdit.sectionItems')}:</label>
                        {(section.items || []).map((item, itemIndex) => (
                          <div key={itemIndex} className="section-item">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const updated = [...editingProduct.descriptionSections];
                                updated[sectionIndex].items[itemIndex] = e.target.value;
                                handleEditChange('descriptionSections', updated);
                              }}
                            />
                            <button
                              type="button"
                              className="btn-remove-item"
                              onClick={() => {
                                const updated = [...editingProduct.descriptionSections];
                                updated[sectionIndex].items.splice(itemIndex, 1);
                                handleEditChange('descriptionSections', updated);
                              }}
                            >
                              ❌ {t('productEdit.removeItem')}
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn-add-item"
                          onClick={() => {
                            const updated = [...editingProduct.descriptionSections];
                            updated[sectionIndex].items.push('');
                            handleEditChange('descriptionSections', updated);
                          }}
                        >
                          ➕ {t('productEdit.addItem')}
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-remove-section"
                        onClick={() => {
                          const updated = editingProduct.descriptionSections.filter((_, i) => i !== sectionIndex);
                          handleEditChange('descriptionSections', updated);
                        }}
                      >
                        🗑️ {t('productEdit.removeSection')}
                      </button>

                      <hr />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-add-section"
                    onClick={() => {
                      const updated = [...(editingProduct.descriptionSections || [])];
                      updated.push({ title: '', items: [''] });
                      handleEditChange('descriptionSections', updated);
                    }}
                  >
                    ➕ {t('productEdit.addSection')}
                  </button>
                </div>

                <label className="form-label">
                  {t('productEdit.images')}:
                  <input type="text" value={editingProduct.images?.join(',')} onChange={(e) => handleEditChange('images', e.target.value.split(','))} />
                </label>

                <label className="form-label">
                  {t('productEdit.showcaseImageIndex')}:
                  <input type="number" value={editingProduct.showcaseImageIndex || 0} onChange={(e) => handleEditChange('showcaseImageIndex', Number(e.target.value))} />
                </label>

                <div className="modal-buttons">
                  <button type="submit" className="btn-save">💾 {t('productEdit.save')}</button>
                  <button type="button" className="btn-cancel" onClick={() => setEditingProduct(null)}>❌ {t('productEdit.cancel')}</button>
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
