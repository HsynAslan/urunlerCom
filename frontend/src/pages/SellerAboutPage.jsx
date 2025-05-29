import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SellerAboutPage.css'; // Stil dosyasını ekleyin
import SellerSidebar from '../components/SellerSidebar';
const SellerAboutPage = () => {
  const [content, setContent] = useState('');
const token = localStorage.getItem('token');
   
useEffect(() => {
  const token = localStorage.getItem('token');
  axios
    .get('http://localhost:5000/api/sellers/about', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setContent(res.data.content || '');
    })
    .catch(err => {
      console.error(err);
      alert("Veri alınamadı.");
     });
}, []);
const handleSave = async () => {
  const token = localStorage.getItem('token');
  try {
    await axios.put(
      'http://localhost:5000/api/sellers/about',
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert('Kaydedildi!');
  } catch (err) {
    console.error(err);
    alert("Kaydetme işlemi başarısız.");
  }
};

  return (
    <>
    <div className="sidebar">
        <SellerSidebar />
      </div>
    <div className="about-page-container">
      <h2 className="about-title">Hakkımda Sayfası</h2>
      <textarea
        className="about-textarea"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={10}
        placeholder="Hakkınızda bir şeyler yazın..."
      />
      <button className="save-button" onClick={handleSave}>
        Kaydet
      </button>
    </div>
     </>
  );
 
};

export default SellerAboutPage;
