import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SellerPhotosPage.css';
import SellerSidebar from '../components/SellerSidebar';
const SellerPhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/sellers/photos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setPhotos(res.data))
      .catch(err => {
        console.error(err);
        alert('Fotoğraflar alınamadı.');
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
    } catch (err) {
      console.error(err);
      alert('Fotoğraf eklenemedi.');
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/sellers/photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos(prev => prev.filter(photo => photo._id !== id));
    } catch (err) {
      console.error(err);
      alert('Fotoğraf silinemedi.');
    }
  };

  return (
    <>
      <div className="sidebar">
        <SellerSidebar />
      </div>
    <div className="seller-photos-page">
      <h2>📸 Fotoğraflarım</h2>
      <div className="input-group">
        <input placeholder="Resim URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <input placeholder="Açıklama" value={caption} onChange={e => setCaption(e.target.value)} />
        <button onClick={handleAdd}>Ekle</button>
      </div>

      <div className="photo-gallery">
        {photos.map(photo => (
          <div className="photo-card" key={photo._id}>
            <img src={photo.imageUrl} alt="" />
            <p>{photo.caption}</p>
            <button className="delete-button" onClick={() => handleDelete(photo._id)}>Sil</button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default SellerPhotosPage;
