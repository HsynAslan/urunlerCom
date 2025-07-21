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

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/public/sellers/${slug}/full`);
        setData(res.data);
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

  return (
    <div className="public-page">
      {theme && <style dangerouslySetInnerHTML={{ __html: theme }} />}
      
      <header className="header">
        <h1>{company.companyName}</h1>
      </header>

      <section className="hero-section">
        {photos.length > 1 ? (
          <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
            {photos.map(photo => (
              <div key={photo._id}>
                <img src={photo.imageUrl} alt={photo.caption} />
              </div>
            ))}
          </Carousel>
        ) : (
          <img src={photos[0]?.imageUrl} alt="Main" className="hero-single-img" />
        )}
      </section>

      <section className="about-section">
        <div className="section-header">
          <Info />
          <h2>Hakkımızda</h2>
        </div>
        <p>{about.content}</p>
      </section>

      <section className="contact-section">
        <div className="section-header">
          <MapPin />
          <h2>İletişim</h2>
        </div>
        <ul>
          {company.contactInfo?.phone && <li><Phone /> {company.contactInfo.phone}</li>}
          {company.contactInfo?.email && <li><Mail /> {company.contactInfo.email}</li>}
          {company.contactInfo?.address && <li><MapPin /> {company.contactInfo.address}</li>}
          {company.contactInfo?.website && (
            <li>
              <Globe />
              <a href={company.contactInfo.website} target="_blank" rel="noreferrer">
                {company.contactInfo.website}
              </a>
            </li>
          )}
          {company.contactInfo?.instagram && (
            <li>
              <Instagram />
              <a href={`https://instagram.com/${company.contactInfo.instagram}`} target="_blank" rel="noreferrer">
                @{company.contactInfo.instagram}
              </a>
            </li>
          )}
        </ul>
      </section>

      <section className="product-section">
        <div className="section-header">
          <Store />
          <h2>Ürünler</h2>
        </div>
        {products.length ? (
          <div className="product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                {product.images?.length ? (
                  <img
                    src={product.images[product.showcaseImageIndex || 0]}
                    alt={product.name}
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

      <footer className="footer">
        &copy; {new Date().getFullYear()} {company.companyName}
      </footer>
    </div>
  );
};

export default SellerPublicPage;
