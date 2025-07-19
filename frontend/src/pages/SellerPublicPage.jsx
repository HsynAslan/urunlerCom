import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/SellerPublicPage.css';

const SellerPublicPage = () => {
  const { sellerId } = useParams();
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
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

  if (loading) return <div className="spinner">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!sellerData) return <div className="error">Satıcı bulunamadı.</div>;

  return (
    <div className="seller-public-page">
      <header className="seller-header">
        <h1>{sellerData.companyName}</h1>
        {sellerData.about && <p className="seller-about">{sellerData.about}</p>}
      </header>

      {sellerData.photos && sellerData.photos.length > 0 && (
        <section className="seller-photos">
          <h2>Fotoğraflar</h2>
          <div className="photo-grid">
            {sellerData.photos.map(photo => (
              <img key={photo._id} src={photo.imageUrl} alt={photo.caption || 'Fotoğraf'} />
            ))}
          </div>
        </section>
      )}

      {sellerData.products && sellerData.products.length > 0 && (
        <section className="seller-products">
          <h2>Ürünler</h2>
          <ul>
            {sellerData.products.map(product => (
              <li key={product._id} className="product-item">
                <div className="product-image">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="no-image">Resim yok</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">{product.price} {product.priceCurrency}</p>
                  {product.description && <p className="product-description">{product.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default SellerPublicPage;
