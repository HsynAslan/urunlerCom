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

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [companyRes, productsRes, aboutRes, photosRes] = await Promise.all([
          axios.get('http://localhost:5000/api/sellers/store', { headers }),
          axios.get('http://localhost:5000/api/products/mine', { headers }),
          axios.get('http://localhost:5000/api/sellers/about', { headers }),
          axios.get('http://localhost:5000/api/sellers/photos', { headers }),
        ]);

        setCompany(companyRes.data);
        setProducts(productsRes.data);
        setAbout(aboutRes.data?.content || '');
        setPhotos(photosRes.data);
      } catch (err) {
        console.error('Bir şeyler ters gitti:', err);
        setErrors(['Veriler alınırken hata oluştu.']);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

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
      // Burada şema seçim ekranına yönlendirebilirsin
      alert('Tüm bilgiler tamam! Şema seçme ekranına geçebilirsiniz.');
    } else {
      alert('Lütfen eksik bilgileri tamamlayın.');
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
              <li><strong>Telefon:</strong> {company.contactInfo?.phone}</li>
              <li><strong>Email:</strong> {company.contactInfo?.email}</li>
              <li><strong>Adres:</strong> {company.contactInfo?.address}</li>
            </ul>
          ) : <p>Bilgi bulunamadı.</p>}
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
      </div>
    </div>
  );
};

export default SellerPublishPage;
