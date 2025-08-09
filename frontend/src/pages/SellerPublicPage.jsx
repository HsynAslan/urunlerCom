import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Store,
  Info,
  Image as ImageIcon,
  Facebook,
  Twitter,
  Star,
} from 'lucide-react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/SellerPublicPage.css'; // Varsayılan stil
// Örnek: import '../styles/SellerPublicPageDark.css'; // Dark tema
// Örnek: import '../styles/SellerPublicPageModern.css'; // Modern tema

const SellerPublicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const visitSent = useRef(false);
  const phoneClickSent = useRef(false);
  const locationClickSent = useRef(false);

  useEffect(() => {
    if (data?.company) {
      document.title = data.company.companyName || 'Satıcı Sayfası';
      if (data.photos?.[0]?.imageUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = data.photos[0].imageUrl;
      }
    }
  }, [data]);

  const sendStatEvent = async (eventType, duration) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/sellers/${slug}/stats`,
        { eventType, duration }
      );
    } catch (err) {
      console.error('İstatistik gönderilemedi:', err);
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/sellers/${slug}/full`
        );
        setData(res.data);
        setError(null);
        if (!visitSent.current) {
          await sendStatEvent('visit');
          visitSent.current = true;
        }
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/page/not-found');
        } else {
          setError('Veriler yüklenirken hata oluştu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const durationSec = Math.floor((Date.now() - startTime) / 1000);
      if (navigator.sendBeacon) {
        const url = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/sellers/${slug}/stats`;
        const payload = JSON.stringify({ eventType: 'visitDuration', duration: durationSec });
        navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [slug, navigate]);

  if (error) return <div className="error">{error}</div>;

  if (loading || !data) {
    return (
      <div className="loader-wrapper" data-section="loading">
        <div className="loader" />
        <p className="loader-text">Veri Yükleniyor...</p>
      </div>
    );
  }

  const { company, products, about, photos } = data;
  const theme = company.theme?.cssContent;

  const formatPhone = (phone) => phone.replace(/\s+/g, '').replace(/[^+\d]/g, '');
  const handlePhoneClick = () => {
    if (!phoneClickSent.current) {
      sendStatEvent('phoneClick');
      phoneClickSent.current = true;
    }
  };
  const handleLocationClick = () => {
    if (!locationClickSent.current) {
      sendStatEvent('locationClick');
      locationClickSent.current = true;
    }
  };

  return (
    
    <div className="public-page" data-theme={company.theme?.name || 'default'}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />

      {theme && <style dangerouslySetInnerHTML={{ __html: theme }} />}

      {/* Navbar */}
      <nav className="navbar" data-section="navbar">
        <div className="logo">{company.companyName}</div>
        <ul className="nav-links">
          <li><a href="#anasayfa">🏠 Anasayfa</a></li>
          <li><a href="#hakkimda">ℹ️ Hakkımızda</a></li>
          <li><a href="#urunler">🛒 Ürünler</a></li>
          <li><a href="#iletisim">📞 İletişim</a></li>
        </ul>
      </nav>

      {/* Banner / Kampanya alanı */}
      <div className="promo-banner" data-section="banner">
        <p>🎉 Hoşgeldiniz🎉</p>
      </div>

      {/* Anasayfa */}
      <section id="anasayfa" className="home-section" data-section="home">
        <header className="header">
          <h1>{company.companyName}</h1>
          <p className="tagline">{company.tagline || 'Kalite ve güvenin adresi'}</p>
        </header>
        <div className="photos-container">
          {photos.length > 1 ? (
            <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={4000}>
              {photos.map((photo) => (
                <div key={photo._id} className="carousel-image-wrapper">
                  <img src={photo.imageUrl} alt={photo.caption || company.companyName} />
                </div>
              ))}
            </Carousel>
          ) : photos.length === 1 ? (
            <img src={photos[0].imageUrl} alt={company.companyName} className="hero-single-img" />
          ) : (
            <div className="no-photos-placeholder">Fotoğraf bulunmamaktadır</div>
          )}
        </div>
      </section>

      {/* Hakkımızda */}
      <section id="hakkimda" className="about-section" data-section="about">
        <div className="section-header">
          <Info /><h2>ℹ️ Hakkımızda</h2>
        </div>
        <h3>{company.companyName}</h3>
        <p className="about-text long-text">{about?.content || 'Hakkımızda bilgisi bulunmamaktadır.'}</p>
      </section>

      {/* Ürünler */}
      <section id="urunler" className="product-section" data-section="products">
        <div className="section-header">
          <Store /><h2>🛒 Ürünler</h2>
        </div>
        <div className="filter-bar">
          <input type="text" placeholder="Ürün ara..." />
          <select>
            <option>Fiyat: Artan</option>
            <option>Fiyat: Azalan</option>
          </select>
        </div>
        {products.length ? (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card" data-product-id={product._id}>
                {product.images?.length ? (
                  <img
                    src={product.images[product.showcaseImageIndex || 0]}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="product-placeholder"><ImageIcon size={48} /></div>
                )}
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price} {product.priceCurrency}</p>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={i < (product.rating || 0) ? 'filled' : ''} />
                  ))}
                </div>
                {product.descriptionSections?.map((sec, i) => (
                  <div key={i} className="desc-section">
                    <h4>{sec.title}</h4>
                    <ul>{sec.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p>Henüz ürün eklenmemiş.</p>
        )}
      </section>

      {/* İletişim */}
      <section id="iletisim" className="contact-section" data-section="contact">
        <div className="section-header">
          <MapPin /><h2>📞 İletişim</h2>
        </div>
        <h3>{company.companyName}</h3>
        <ul className="contact-list">
          {company.contactInfo?.phone && (
            <li><Phone /> <a href={`tel:${formatPhone(company.contactInfo.phone)}`} onClick={handlePhoneClick}>{company.contactInfo.phone}</a></li>
          )}
          {company.contactInfo?.email && (
            <li><Mail /> <a href={`mailto:${company.contactInfo.email}`}>{company.contactInfo.email}</a></li>
          )}
          {company.contactInfo?.address && (
            <li><MapPin /> <a href={`https://maps.google.com/?q=${encodeURIComponent(company.contactInfo.address)}`} target="_blank" rel="noreferrer" onClick={handleLocationClick}>{company.contactInfo.address}</a></li>
          )}
          {company.contactInfo?.website && (
            <li><Globe /> <a href={company.contactInfo.website} target="_blank" rel="noreferrer">{company.contactInfo.website}</a></li>
          )}
          {company.contactInfo?.instagram && (
            <li><Instagram /> <a href={`https://instagram.com/${company.contactInfo.instagram}`} target="_blank" rel="noreferrer">@{company.contactInfo.instagram}</a></li>
          )}
          {/* Ek sosyal ikonlar */}
          {company.contactInfo?.facebook && (
            <li><Facebook /> <a href={company.contactInfo.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
          )}
          {company.contactInfo?.twitter && (
            <li><Twitter /> <a href={company.contactInfo.twitter} target="_blank" rel="noreferrer">Twitter</a></li>
          )}
        </ul>
        {company.contactInfo?.address && (
          <div className="map-container">
            <iframe
              title="Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(company.contactInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
      </section>

      <footer className="footer" data-section="footer">
        <p>&copy; {new Date().getFullYear()} {company.companyName}</p>
      </footer>
    </div>
  );
};

export default SellerPublicPage;
