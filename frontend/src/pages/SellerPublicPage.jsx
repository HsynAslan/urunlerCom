import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SellerPublicPage = () => {
  const { sellerId } = useParams();
  const [sellerData, setSellerData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/public/sellers/${sellerId}`);
        if (!res.ok) throw new Error('Satıcı bilgileri alınamadı');
        const data = await res.json();
        setSellerData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSeller();
  }, [sellerId]);

  if (error) return <div>{error}</div>;
  if (!sellerData) return <div>Yükleniyor...</div>;

  const {
    companyName,
    contactInfo,
    theme,
    about,
    photos,
    products,
  } = sellerData;

  return (
    <div className="seller-public-page">
      {/* Tema CSS'si uygulanıyor */}
      {theme?.cssContent && (
        <style dangerouslySetInnerHTML={{ __html: theme.cssContent }} />
      )}

      <header>
        <h1>{companyName}</h1>
      </header>

      <section id="about">
        <h2>Hakkımızda</h2>
        <p>{about}</p>
      </section>

      <section id="contact">
        <h2>İletişim</h2>
        <ul>
          {contactInfo?.phone && <li><strong>Telefon:</strong> {contactInfo.phone}</li>}
          {contactInfo?.email && <li><strong>Email:</strong> {contactInfo.email}</li>}
          {contactInfo?.address && <li><strong>Adres:</strong> {contactInfo.address}</li>}
          {contactInfo?.website && <li><strong>Web:</strong> <a href={contactInfo.website} target="_blank" rel="noreferrer">{contactInfo.website}</a></li>}
          {contactInfo?.instagram && <li><strong>Instagram:</strong> <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noreferrer">@{contactInfo.instagram}</a></li>}
        </ul>
      </section>

      <section id="gallery">
        <h2>Fotoğraflar</h2>
        <div className="photo-gallery">
          {photos.map((photo) => (
            <figure key={photo._id}>
              <img src={photo.imageUrl} alt={photo.caption || ''} />
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </section>

      <section id="products">
        <h2>Ürünler</h2>
        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={product.images[product.showcaseImageIndex || 0]}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>{product.price} {product.priceCurrency}</p>
              {product.descriptionSections && product.descriptionSections.map((sec, i) => (
                <div key={i}>
                  <h4>{sec.title}</h4>
                  <ul>
                    {sec.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} {companyName}</p>
      </footer>
    </div>
  );
};

export default SellerPublicPage;
