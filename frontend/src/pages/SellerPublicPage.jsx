import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/SellerPublicPage.css';  

const SellerPublicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa title ve favicon ayarı
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

  // Backend istatistik gönderme fonksiyonu
  const sendStatEvent = async (eventType, duration) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/sellers/${slug}/stats`,
        { eventType, duration }
      );
    } catch (err) {
      // Hata loglanabilir ama kullanıcıya göstermiyoruz
      console.error('İstatistik gönderilemedi:', err);
    }
  };

  // Sayfa veri çekme ve aynı zamanda ziyaret kaydı gönderme
 useEffect(() => {
  if (!slug) return;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/sellers/${slug}/full`);
      setData(res.data);
      setError(null);
      
      // Sayfa açılır açılmaz ziyaret kaydı gönder
      await sendStatEvent('visit');
      
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
      const data = JSON.stringify({ eventType: 'visitDuration', duration: durationSec });
      navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/sellers/${slug}/stats`, false);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify({ eventType: 'visitDuration', duration: durationSec }));
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
      <div className="loader-wrapper">
        <div className="loader" />
        <p className="loader-text">Veri Yükleniyor...</p>
      </div>
    );
  }

  const { company, products, about, photos } = data;
  const theme = company.theme?.cssContent;

  // Telefon ve mail linkleri için fonksiyon
  const formatPhone = (phone) => phone.replace(/\s+/g, '').replace(/[^+\d]/g, '');

  // Telefon tıklaması için handler
  const handlePhoneClick = () => {
    sendStatEvent('phoneClick');
  };

  // Konum tıklaması için handler
  const handleLocationClick = () => {
    sendStatEvent('locationClick');
  };

  // QR kod indirme veya sipariş butonu varsa, oraya da handler eklenebilir
  // Örnek: handleQRDownload(), handleOrderPlaced() gibi

  return (
    <div className="public-page">

      {/* Tema CSS'si (örneğin eTicaretTema.css içeriği) */}
      {theme && <style dangerouslySetInnerHTML={{ __html: theme }} />}

      {/* Navbar iskeleti */}
      <nav className="navbar">
        <ul>
          <li><a href="#anasayfa">🏠 Anasayfa</a></li>
          <li><a href="#hakkimda">ℹ️ Hakkımızda</a></li>
          <li><a href="#urunler">🛒 Ürünler</a></li>
          <li><a href="#iletisim">📞 İletişim</a></li>
        </ul>
      </nav>

      {/* Anasayfa */}
      <section id="anasayfa" className="home-section">
        <header className="header">
          <h1>{company.companyName}</h1>
        </header>
        <div className="photos-container">
          {photos.length > 1 ? (
            <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={4000} stopOnHover={true}>
              {photos.map(photo => (
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
      <section id="hakkimda" className="about-section">
        <div className="section-header">
          <Info />
          <h2>ℹ️ Hakkımızda</h2>
        </div>
        <h3>{company.companyName}</h3>
        <p>{about?.content || 'Hakkımızda bilgisi bulunmamaktadır.'}</p>
      </section>

      {/* Ürünler */}
      <section id="urunler" className="product-section">
        <div className="section-header">
          <Store />
          <h2>🛒 Ürünler</h2>
        </div>
        {products.length ? (
          <div className="product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                {product.images?.length ? (
                  <img
                    src={product.images[product.showcaseImageIndex || 0]}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="product-placeholder">
                    <ImageIcon size={48} />
                  </div>
                )}
                <h3>{product.name}</h3>
                <p>{product.price} {product.priceCurrency}</p>
                {product.descriptionSections?.map((sec, i) => (
                  <div key={i} className="desc-section">
                    <h4>{sec.title}</h4>
                    <ul>
                      {sec.items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
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
      <section id="iletisim" className="contact-section">
        <div className="section-header">
          <MapPin />
          <h2>📞 İletişim</h2>
        </div>
        <h3>{company.companyName}</h3>
        <ul className="contact-list">
          {company.contactInfo?.phone && (
            <li>
              <Phone />{' '}
              <a
                href={`tel:${formatPhone(company.contactInfo.phone)}`}
                onClick={handlePhoneClick} // Telefon tıklama istatistiği gönderiliyor
              >
                {company.contactInfo.phone}
              </a>
            </li>
          )}
          {company.contactInfo?.email && (
            <li>
              <Mail />{' '}
              <a href={`mailto:${company.contactInfo.email}`}>
                {company.contactInfo.email}
              </a>
            </li>
          )}
          {company.contactInfo?.address && (
            <li>
              <MapPin />{' '}
              <a
                href="#iletisim"
                onClick={handleLocationClick} // Konum tıklama istatistiği gönderiliyor
              >
                {company.contactInfo.address}
              </a>
            </li>
          )}
          {company.contactInfo?.website && (
            <li>
              <Globe />{' '}
              <a href={company.contactInfo.website} target="_blank" rel="noreferrer">
                {company.contactInfo.website}
              </a>
            </li>
          )}
          {company.contactInfo?.instagram && (
            <li>
              <Instagram />{' '}
              <a
                href={`https://instagram.com/${company.contactInfo.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                @{company.contactInfo.instagram}
              </a>
            </li>
          )}
        </ul>

        {/* Google Maps iframe (adres varsa) */}
        {company.contactInfo?.address && (
          <div className="map-container" aria-label="Şirket Adresi Haritası">
            <iframe
              title="Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(company.contactInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </section>

      <footer className="footer">
        &copy; {new Date().getFullYear()} {company.companyName}
      </footer>
    </div>
  );
};

export default SellerPublicPage;
