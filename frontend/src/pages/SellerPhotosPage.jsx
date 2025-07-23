import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import '../styles/SellerPhotosPage.css';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';

const SellerPhotosPage = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/sellers/photos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPhotos(res.data))
      .catch((err) => {
        console.error(err);
        toast.error('❌ ' + t('photoList.fetchError', 'Fotoğraflar alınamadı.'));
      });
  }, []);

  const handleAdd = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/sellers/photos',
        { imageUrl, caption },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPhotos([...photos, res.data]);
      setImageUrl('');
      setCaption('');
      toast.success('✅ ' + t('photoList.added', 'Fotoğraf eklendi.'));
    } catch (err) {
      console.error(err);
      toast.error('❌ ' + t('photoList.addError', 'Fotoğraf eklenemedi.'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sellers/photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos((prev) => prev.filter((photo) => photo._id !== id));
      toast.success('🗑️ ' + t('photoList.deleted', 'Fotoğraf silindi.'));
    } catch (err) {
      console.error(err);
      toast.error('❌ ' + t('photoList.deleteError', 'Fotoğraf silinemedi.'));
    }
  };

  return (
    <div className="seller-layout">
      <div className="seller-sidebar">
        <SellerSidebar />
      </div>
       <div className="language-selector-container">
          <LanguageSelector />
        </div>
      <div className="seller-content">
        <h2 className="page-header">
          <span className="emoji">📸</span>
          {t('photoList.title', 'Fotoğraflarım')}
        </h2>

        <div className="form-group">
          <label className="form-label">{t('photoList.imageUrl', 'Görsel URL')}</label>
          <input
            type="text"
            className="form-input"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />

          <label className="form-label">{t('photoList.caption', 'Açıklama')}</label>
          <input
            type="text"
            className="form-input"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={t('photoList.captionPlaceholder', 'Ürün vitrin resmi vs.')}
          />

          <button className="form-button" onClick={handleAdd}>
            ➕ {t('photoList.add', 'Ekle')}
          </button>
        </div>

        <div className="photo-gallery">
          {photos.map((photo) => (
            <div className="photo-card" key={photo._id}>
              <img src={photo.imageUrl} alt={photo.caption || t('photoList.photoAlt', 'Fotoğraf')} />
              <p>{photo.caption}</p>
              <button
                className="delete-button"
                onClick={() => handleDelete(photo._id)}
              >
                🗑️ {t('photoList.delete', 'Sil')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerPhotosPage;
