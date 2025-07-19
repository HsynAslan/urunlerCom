import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';

const AdminThemePage = () => {
  const [themes, setThemes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    cssFileUrl: '',
    previewImageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchThemes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/themes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setThemes(res.data);
    } catch (err) {
      console.error('Temalar alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    console.log('Form verisi gönderiliyor:', form);
    console.log('Gönderilen token:', token);

    const response = await axios.post('http://localhost:5000/api/themes', form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Sunucudan yanıt:', response.data);

    setForm({ name: '', cssFileUrl: '', previewImageUrl: '' });
    await fetchThemes();
  } catch (err) {
    if (err.response) {
      console.error('Sunucu hatası:', err.response.data);
    } else if (err.request) {
      console.error('İstek yapıldı ama yanıt alınamadı:', err.request);
    } else {
      console.error('İstek hatası:', err.message);
    }
    setError('Tema eklenemedi.');
  } finally {
    setLoading(false);
  }
};


const handleDelete = async (id) => {
  console.log('Silme işlemi başlatıldı, silinecek tema ID:', id);

  if (!window.confirm('Bu temayı silmek istediğinize emin misiniz?')) {
    console.log('Silme işlemi kullanıcı tarafından iptal edildi.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    console.log('Gönderilen token:', token);

    const res = await axios.delete(`http://localhost:5000/api/themes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Sunucudan gelen yanıt:', res.data);

    fetchThemes();
  } catch (err) {
    if (err.response) {
      // Sunucudan gelen hata yanıtı varsa
      console.error('Sunucu hatası:', err.response.data);
      alert(`Tema silinemedi: ${err.response.data.message || 'Bilinmeyen hata'}`);
    } else if (err.request) {
      // İstek yapıldı ama yanıt alınamadıysa
      console.error('İstek yapıldı ama yanıt alınamadı:', err.request);
      alert('Tema silinemedi: Sunucudan yanıt alınamadı.');
    } else {
      // İstek oluşturulurken oluşan hata
      console.error('İstek hatası:', err.message);
      alert(`Tema silinemedi: ${err.message}`);
    }
  }
};


  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'rgba(249, 250, 251, 0.7)' }}>
      <AdminSidebar />
      
      <div style={{ width: '80%', marginLeft: '20%', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Tema Ayarları</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Tema Adı"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '0.5rem' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="CSS Dosya URL"
              value={form.cssFileUrl}
              onChange={(e) => setForm({ ...form, cssFileUrl: e.target.value })}
              style={{ width: '100%', padding: '0.5rem' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Önizleme Görseli URL (opsiyonel)"
              value={form.previewImageUrl}
              onChange={(e) => setForm({ ...form, previewImageUrl: e.target.value })}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {loading ? 'Ekleniyor...' : 'Tema Ekle'}
          </button>
          {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        </form>

        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Mevcut Temalar</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {themes.map((theme) => (
            <div
              key={theme._id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                position: 'relative'
              }}
            >
              {theme.previewImageUrl ? (
                <img
                  src={theme.previewImageUrl}
                  alt={theme.name}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', marginBottom: '0.5rem' }}
                />
              ) : (
                <div
                  style={{
                    height: '120px',
                    backgroundColor: '#f3f4f6',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af'
                  }}
                >
                  Önizleme yok
                </div>
              )}
              <h4 style={{ fontWeight: '600' }}>{theme.name}</h4>
              <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{theme.cssFileUrl}</p>

              <button
                onClick={() => handleDelete(theme._id)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
                title="Temayı Sil"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminThemePage;
