import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import SellerSidebar from '../components/SellerSidebar';
import Spinner from '../components/Spinner';
import '../styles/SellerPublishPage.css';
import LanguageSelector from '../components/LanguageSelector';

const SellerPublishPage = () => {
  const { t } = useTranslation();

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
  const [slug, setSlug] = useState(null);

  // 1. Seller info çek
  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/sellers/store', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSlug(res.data.slug);
      } catch (err) {
        console.error('Satıcı bilgisi alınamadı:', err);
        setErrors([t('publishPage.errors.sellerInfo')]);
        setLoading(false);
        toast.error(t('publishPage.errors.sellerInfo'));
      }
    };
    fetchSellerInfo();
  }, [token, t]);

  // 2. Public seller data çek
  useEffect(() => {
    if (!slug) return;

    const fetchPublicSellerData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/public/sellers/${slug}`);
        setCompany(res.data.company);
        setProducts(res.data.products);
        setAbout(res.data.about?.content || '');
        setPhotos(res.data.photos);
        setErrors([]);
      } catch (err) {
        console.error('Public satıcı verisi alınamadı:', err);
        setErrors([t('publishPage.errors.publicData')]);
        toast.error(t('publishPage.errors.publicData'));
      } finally {
        setLoading(false);
      }
    };
    fetchPublicSellerData();
  }, [slug, t]);

  const checkDataCompleteness = () => {
    const errorList = [];

    if (!company?.companyName || !company.contactInfo?.phone)
      errorList.push(t('publishPage.errors.companyInfo'));
    if (products.length === 0)
      errorList.push(t('publishPage.errors.products'));
    if (!about || about.trim().length < 10)
      errorList.push(t('publishPage.errors.about'));
    if (photos.length < 1)
      errorList.push(t('publishPage.errors.photos'));

    setErrors(errorList);
    return errorList.length === 0;
  };

  const handleContinue = () => {
    if (checkDataCompleteness()) {
      fetchSchemas();
    } else {
      toast.warn(t('publishPage.warnings.completeData'));
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
      toast.error(t('publishPage.errors.schemas'));
    } finally {
      setLoading(false);
    }
  };

  const handleSchemaSelect = async () => {
    if (!selectedSchemaId) {
      toast.info(t('publishPage.info.selectSchema'));
      return;
    }

    try {
      setSavingSchema(true);
      await axios.post(
        'http://localhost:5000/api/sellers/select-schema',
        { schemaId: selectedSchemaId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const url = `http://localhost:3000/${slug}`;
      setPublishedUrl(url);
      setShowSchemaModal(false);
      toast.success(t('publishPage.success.published'));
    } catch (err) {
      console.error('Şema kaydedilemedi:', err);
      toast.error(t('publishPage.errors.saveSchema'));
    } finally {
      setSavingSchema(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="seller-layout">
      <div className="seller-sidebar">
        <SellerSidebar />
      </div>
  <div className="language-selector-container">
          <LanguageSelector />
        </div>
      <main className="seller-content publish-page">
        <h1 className="page-header">
          <span className="emoji">📄</span> {t('publishPage.title')}
        </h1>

        <section className="publish-section">
          <h2 className="section-header">🔹 {t('publishPage.companyInfo')}</h2>
          {company ? (
            <ul className="company-info-list">
              <li>
                <strong>{t('publishPage.companyName')}:</strong> {company.companyName}
              </li>
              <li>
                <strong>{t('publishPage.slug')}:</strong> {slug || '-'}
              </li>
              <li>
                <strong>{t('publishPage.phone')}:</strong> {company.contactInfo?.phone}
              </li>
              <li>
                <strong>{t('publishPage.email')}:</strong> {company.contactInfo?.email}
              </li>
              <li>
                <strong>{t('publishPage.address')}:</strong> {company.contactInfo?.address}
              </li>
            </ul>
          ) : (
            <p>{t('publishPage.noData')}</p>
          )}
        </section>

        <section className="publish-section">
          <h2 className="section-header">📦 {t('publishPage.products')} ({products.length})</h2>
          <ul className="products-list">
            {products.map((p) => (
              <li key={p._id}>
                {p.name} - {p.price} {p.priceCurrency}
              </li>
            ))}
          </ul>
        </section>

        <section className="publish-section">
          <h2 className="section-header">🧾 {t('publishPage.about')}</h2>
          <p>{about || t('publishPage.noAbout')}</p>
        </section>

        <section className="publish-section">
          <h2 className="section-header">🖼️ {t('publishPage.photos')} ({photos.length})</h2>
          <div className="photo-preview-grid">
            {photos.map((p) => (
              <img
                key={p._id}
                src={p.imageUrl}
                alt={p.caption || t('publishPage.photoAlt')}
                className="photo-preview-img"
              />
            ))}
          </div>
        </section>

        {errors.length > 0 && (
          <div className="error-box">
            <h3>{t('publishPage.errors.title')}</h3>
            <ul>
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <button className="form-button publish-btn" onClick={handleContinue}>
          {t('publishPage.continue')} ➡️
        </button>

        {/* Şema seçim modalı */}
        {showSchemaModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{t('publishPage.schemaModal.title')}</h2>
              {schemas.length === 0 ? (
                <p>{t('publishPage.schemaModal.noSchemas')}</p>
              ) : (
                <ul className="schema-list">
                  {schemas.map((schema) => (
                    <li
                      key={schema._id}
                      className="schema-item"
                      style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' , justifyContent: 'space-between' }}
                    >
                      <div> <label style={{ flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <input
                          type="radio"
                          name="schema"
                          value={schema._id}
                          onChange={() => setSelectedSchemaId(schema._id)}
                          checked={selectedSchemaId === schema._id}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {schema.name}
                      </label></div>
                     
                      {schema.previewImageUrl && (
                        <img
                          src={schema.previewImageUrl}
                          alt={`${schema.name} ${t('publishPage.schemaModal.previewAlt')}`}
                          style={{
                            width: '100px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginLeft: '1rem',
                          }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}

              <div className="modal-buttons">
                <button className="form-button" onClick={handleSchemaSelect} disabled={savingSchema}>
                  {savingSchema ? t('publishPage.schemaModal.saving') : t('publishPage.schemaModal.confirm')}
                </button>
                <button className="form-button cancel-btn" onClick={() => setShowSchemaModal(false)} disabled={savingSchema}>
                  {t('publishPage.schemaModal.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Yayınlanan URL göster */}
        {publishedUrl && (
          <div className="published-url-box">
            <p>
              {t('publishPage.publishedUrlLabel')}{' '}
              <a href={publishedUrl} target="_blank" rel="noopener noreferrer">
                {publishedUrl}
              </a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerPublishPage;
