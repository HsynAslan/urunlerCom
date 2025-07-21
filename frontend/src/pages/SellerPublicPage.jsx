import React, { useEffect, useState } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import axios from 'axios';
import '../styles/SellerPublicPage.css';
const SellerPublicPage = () => {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();

useEffect(() => {
  console.log('Slug param:', slug);
  if (!slug) return;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('api isteiği gitmeden önce:', slug);
      const res = await axios.get(`http://localhost:5000/api/public/sellers/${slug}/full`);
      setData(res.data);
    } catch (err) {
      console.error('API isteğinde hata:', err);
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
}, [slug]);



  
  if (error ) return <div style={{ color: 'red' }}>{error  }</div>;
if (!data) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center'
    }}>
      <div className="spinner" />
      <div style={{ color: 'white', marginTop: '1rem', backgroundColor:'gray' }}>{'Veri Yükleniyor'}</div>

      <style>{`
        .spinner {
          width: 60px;
          height: 60px;
          border: 5px solid #ccc;
          border-top: 5px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

 // Burada artık data null değil, güvenle destructure edebilirsin
  const { company, products, about, photos } = data;
  return (
    <div className="seller-public-page">
      {company.theme?.cssContent && (
        <style dangerouslySetInnerHTML={{ __html: company.theme.cssContent }} />
      )}

      <header>
        <h1>{company.companyName || 'Şirket Adı Bulunamadı'}</h1>
      </header>

      <section id="about">
        <h2>Hakkımızda</h2>
        <p>{about.content || 'Hakkımızda bilgisi bulunamadı.'}</p>
      </section>

      <section id="contact">
        <h2>İletişim</h2>
        {company.contactInfo ? (
          <ul>
            {company.contactInfo.phone && <li><strong>Telefon:</strong> {company.contactInfo.phone}</li>}
            {company.contactInfo.email && <li><strong>Email:</strong> {company.contactInfo.email}</li>}
            {company.contactInfo.address && <li><strong>Adres:</strong> {company.contactInfo.address}</li>}
            {company.contactInfo.website && (
              <li>
                <strong>Web:</strong>{' '}
                <a href={company.contactInfo.website} target="_blank" rel="noopener noreferrer">
                  {company.contactInfo.website}
                </a>
              </li>
            )}
            {company.contactInfo.instagram && (
              <li>
                <strong>Instagram:</strong>{' '}
                <a href={`https://instagram.com/${company.contactInfo.instagram}`} target="_blank" rel="noopener noreferrer">
                  @{company.contactInfo.instagram}
                </a>
              </li>
            )}
          </ul>
        ) : (
          <p>İletişim bilgisi bulunamadı.</p>
        )}
      </section>

      <section id="gallery">
        <h2>Fotoğraflar</h2>
        {photos.length > 0 ? (
          <div className="photo-gallery" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {photos.map(photo => (
              <figure key={photo._id} style={{ maxWidth: '200px' }}>
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'Fotoğraf'}
                  style={{ width: '100%', borderRadius: '8px' }}
                  loading="lazy"
                />
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>
        ) : (
          <p>Fotoğraf bulunamadı.</p>
        )}
      </section>

      <section id="products">
        <h2>Ürünler</h2>
        {products.length > 0 ? (
          <div className="product-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {products.map(product => (
              <div key={product._id} className="product-card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', width: '250px' }}>
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[product.showcaseImageIndex || 0]}
                    alt={product.name}
                    style={{ width: '100%', borderRadius: '6px' }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#eee', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span>Resim yok</span>
                  </div>
                )}
                <h3>{product.name}</h3>
                <p>{product.price} {product.priceCurrency}</p>
                {product.descriptionSections?.map((sec, i) => (
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
        ) : (
          <p>Ürün bulunamadı.</p>
        )}
      </section>

      <footer style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem', textAlign: 'center', color: '#666' }}>
        <p>&copy; {new Date().getFullYear()} {company.companyName || 'Şirket'}</p>
      </footer>
    </div>
  );
};

export default SellerPublicPage;
