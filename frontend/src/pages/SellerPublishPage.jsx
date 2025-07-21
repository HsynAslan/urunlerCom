import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import Spinner from '../components/Spinner';
import '../styles/SellerPublishPage.css';

const SellerPublishPage = () => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [about, setAbout] = useState('');
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState([]);

  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [schemas, setSchemas] = useState([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState(null);
  const [savingSchema, setSavingSchema] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState(null);

  const token = localStorage.getItem('token');

  // İlk aşamada sellerInfo (slug dahil) çekilecek
  const [slug, setSlug] = useState(null);

  // 1. sellerInfo ve slug'ı al
  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/sellers/store', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSlug(res.data.slug);  // slug backend’den geliyor varsayalım
      } catch (err) {
        console.error('Satıcı bilgisi alınamadı:', err);
        setErrors(['Satıcı bilgisi alınamadı.']);
        setLoading(false);
      }
    };

    fetchSellerInfo();
  }, [token]);

  // 2. slug geldikten sonra detaylı public veriyi çek
  useEffect(() => {
    if (!slug) return;

    const fetchPublicSellerData = async () => {
      setLoading(true);
      try {
        const baseUrl = `http://localhost:5000/api/public/sellers/${slug}`;
        const res = await axios.get(baseUrl);

        setCompany(res.data.company);
        setProducts(res.data.products);
        setAbout(res.data.about?.content || '');
        setPhotos(res.data.photos);
        setErrors([]);
      } catch (err) {
        console.error('Public satıcı verisi alınamadı:', err);
        setErrors(['Veriler alınırken hata oluştu.']);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSellerData();
  }, [slug]);

  const checkDataCompleteness = () => {
    const errorList = [];

    if (!company?.companyName || !company.contactInfo?.phone) errorList.push('Şirket bilgileri eksik.');
    if (products.length === 0) errorList.push('En az bir ürün eklenmeli.');
    if (!about || about.trim().length < 10) errorList.push('Hakkımda yazısı yeterli değil.');
    if (photos.length < 1) errorList.push('En az bir fotoğraf eklenmeli.');

    setErrors(errorList);
    return errorList.length === 0;
  };

  const handleContinue = () => {
    if (checkDataCompleteness()) {
      fetchSchemas();
    } else {
      alert('Lütfen eksik bilgileri tamamlayın.');
    }
  };

  const fetchSchemas = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/themes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchemas(res.data);
      setShowSchemaModal(true);
    } catch (err) {
      console.error('Şemalar alınamadı:', err);
      alert('Şemalar alınamadı.');
    } finally {
      setLoading(false);
    }
  };

const handleSchemaSelect = async () => {
  if (!selectedSchemaId) {
    alert('Lütfen bir şema seçin.');
    return;
  }

  try {
    setSavingSchema(true);

    // Backend'e schema seçimini kaydet
    const res = await axios.post(
      'http://localhost:5000/api/sellers/select-schema',
      { schemaId: selectedSchemaId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Backend, seçilen şema ve slug ile yeni URL'yi döndürmeli:
    // Örnek: { publishedUrl: `http://localhost:3000/seller/${slug}` }
    // Burada 'slug' state'de zaten mevcut

    // Eğer backend sadece sellerId dönerse, frontend'de slug'ı kullanarak url yap
    const url = `http://localhost:3000/seller/${slug}`;
    console.log('Yayınlanan URL:', url);
    setPublishedUrl(url);
    setShowSchemaModal(false);
    alert('Şema seçildi ve sayfanız yayınlandı!');
  } catch (err) {
    console.error('Şema kaydedilemedi:', err);
    
    alert('Şema kaydedilemedi.');
  } finally {
    setSavingSchema(false);
  }
};


  if (loading) return <Spinner />;

  return (
    <div className="publish-page-container">
      <div className="sidebar">
        <SellerSidebar />
      </div>

      <div className="publish-page-content">
        <h1>📄 Sayfayı Yayınlamaya Hazırla</h1>

        <div className="section">
          <h2>🔹 Şirket Bilgileri</h2>
          {company ? (
            <ul>
              <li><strong>Şirket Adı:</strong> {company.companyName}</li>
              <li><strong>Sayfa URL'si (slug):</strong> {slug || '-'}</li>
              <li><strong>Telefon:</strong> {company.contactInfo?.phone}</li>
              <li><strong>Email:</strong> {company.contactInfo?.email}</li>
              <li><strong>Adres:</strong> {company.contactInfo?.address}</li>
            </ul>
          ) : (
            <p>Bilgi bulunamadı.</p>
          )}
        </div>

        <div className="section">
          <h2>📦 Ürünler ({products.length})</h2>
          <ul>
            {products.map(p => (
              <li key={p._id}>{p.name} - {p.price} {p.priceCurrency}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>🧾 Hakkımda</h2>
          <p>{about || 'Henüz yazı eklenmemiş.'}</p>
        </div>

        <div className="section">
          <h2>🖼️ Fotoğraflar ({photos.length})</h2>
          <div className="photo-preview-grid">
            {photos.map(p => (
              <img key={p._id} src={p.imageUrl} alt={p.caption} />
            ))}
          </div>
        </div>

        {errors.length > 0 && (
          <div className="error-box">
            <h3>Eksikler:</h3>
            <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}

        <button className="publish-btn" onClick={handleContinue}>
          Devam Et ➡️
        </button>

        {/* Şema seçim modalı */}
        {showSchemaModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Şema Seçiniz</h2>
              {schemas.length === 0 ? (
                <p>Şema bulunamadı.</p>
              ) : (
                <ul>
                  {schemas.map(schema => (
                    <li key={schema._id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                      <label style={{ flex: 1, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="schema"
                          value={schema._id}
                          onChange={() => setSelectedSchemaId(schema._id)}
                          checked={selectedSchemaId === schema._id}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {schema.name}
                      </label>
                      {schema.previewImageUrl && (
                        <img
                          src={schema.previewImageUrl}
                          alt={`${schema.name} önizlemesi`}
                          style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginLeft: '1rem' }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}

              <button onClick={handleSchemaSelect} disabled={savingSchema}>
                {savingSchema ? 'Kaydediliyor...' : 'Onayla ve Yayınla'}
              </button>
              <button onClick={() => setShowSchemaModal(false)} disabled={savingSchema}>
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Yayınlanan URL göster */}
        {publishedUrl && (
          <div className="published-url-box">
            <p>
              Sayfanız yayınlandı: <a href={publishedUrl} target="_blank" rel="noopener noreferrer">{publishedUrl}</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPublishPage;
