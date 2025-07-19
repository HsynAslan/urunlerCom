import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/SellerPublicPage.css';
const SellerPublicPage = () => {
  const { sellerId } = useParams();
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/public/sellers/${sellerId}`);
        setSellerData(res.data);
      } catch (err) {
        setError('Satıcı bilgileri alınırken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  // Tema CSS'i sayfaya ekle
  useEffect(() => {
    if (!sellerData || !sellerData.selectedTheme || !sellerData.selectedTheme.cssContent) return;

    const styleTag = document.createElement('style');
    styleTag.id = 'dynamic-theme-style';
    styleTag.innerHTML = sellerData.selectedTheme.cssContent;
    document.head.appendChild(styleTag);

    return () => {
      const existing = document.getElementById('dynamic-theme-style');
      if (existing) existing.remove();
    };
  }, [sellerData]);

  if (loading) return <div className="spinner">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!sellerData) return <div className="error">Satıcı bulunamadı.</div>;

  return (
    <div className="seller-public-page">
      <nav className="seller-nav">
        <ul>
          <li className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Anasayfa</li>
          <li className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>Hakkımda</li>
          <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Ürünler</li>
          <li className={activeTab === 'photos' ? 'active' : ''} onClick={() => setActiveTab('photos')}>Fotoğraflar</li>
          <li className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>İletişim</li>
        </ul>
      </nav>

      <main>
        {activeTab === 'home' && (
          <section className="tab-content home">
            <h1>{sellerData.companyName}</h1>
            <p>Hoşgeldiniz! Sayfamıza göz atabilirsiniz.</p>
          </section>
        )}

        {activeTab === 'about' && (
          <section className="tab-content about">
            <h2>Hakkımda</h2>
            <p>{sellerData.about || 'Hakkımda bilgisi henüz eklenmemiş.'}</p>
          </section>
        )}

        {activeTab === 'products' && (
          <section className="tab-content products">
            <h2>Ürünler</h2>
            {sellerData.products && sellerData.products.length > 0 ? (
              <ul className="product-list">
                {sellerData.products.map(product => (
                  <li key={product._id} className="product-item">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="product-image" />
                    ) : (
                      <div className="no-image">Resim yok</div>
                    )}
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-price">{product.price} {product.priceCurrency}</p>
                      <p className="product-description">{product.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Ürün bulunamadı.</p>
            )}
          </section>
        )}

        {activeTab === 'photos' && (
          <section className="tab-content photos">
            <h2>Fotoğraflar</h2>
            {sellerData.photos && sellerData.photos.length > 0 ? (
              <div className="photo-grid">
                {sellerData.photos.map(photo => (
                  <img key={photo._id} src={photo.imageUrl} alt={photo.caption || 'Fotoğraf'} />
                ))}
              </div>
            ) : (
              <p>Fotoğraf bulunamadı.</p>
            )}
          </section>
        )}

        {activeTab === 'contact' && (
          <section className="tab-content contact">
            <h2>İletişim</h2>
            <p>
              Telefon: {sellerData.contactInfo?.phone || '-'} <br />
              Email: {sellerData.contactInfo?.email || '-'} <br />
              Adres: {sellerData.contactInfo?.address || '-'}
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default SellerPublicPage;
