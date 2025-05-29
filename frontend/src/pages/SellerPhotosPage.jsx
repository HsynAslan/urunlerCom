import { useState, useEffect } from 'react';
import axios from 'axios';

const SellerPhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/sellers/photos').then(res => setPhotos(res.data));
  }, []);

  const handleAdd = async () => {
    const res = await axios.post('http://localhost:5000/api/sellers/photos', { imageUrl, caption });
    setPhotos([...photos, res.data]);
    setImageUrl('');
    setCaption('');
  };

  return (
    <div>
      <h2>Fotoğraflarım</h2>
      <input placeholder="Resim URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      <input placeholder="Açıklama" value={caption} onChange={e => setCaption(e.target.value)} />
      <button onClick={handleAdd}>Ekle</button>

      <div className="photo-gallery">
        {photos.map(photo => (
          <div key={photo._id}>
            <img src={photo.imageUrl} alt="" width="200" />
            <p>{photo.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerPhotosPage;
