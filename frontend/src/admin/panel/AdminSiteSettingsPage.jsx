import { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AdminSiteSettingsPage.css'; // CSS dosyasını içe aktar
import AdminSidebar from '../components/AdminSidebar';
const SiteSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    frontendUrl: '',
    apiUrl: '',
    mailSettings: { email: '', password: '' },
    defaultLanguage: 'tr',
    maintenanceMode: false,
    socialLinks: {},
    contactPhone: '',
    contactAddress: '',
    apiEndpoints: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('site');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/settings`, { headers });
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleApiChange = (index, field, value) => {
    const newEndpoints = [...settings.apiEndpoints];
    newEndpoints[index][field] = value;
    setSettings(prev => ({ ...prev, apiEndpoints: newEndpoints }));
  };

  const addApiEndpoint = () => {
    setSettings(prev => ({
      ...prev,
      apiEndpoints: [...(prev.apiEndpoints || []), { name: '', path: '', method: '', description: '' }]
    }));
  };

  const removeApiEndpoint = (index) => {
    setSettings(prev => ({
      ...prev,
      apiEndpoints: prev.apiEndpoints.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/settings`, settings, { headers });
      alert('Kaydedildi!');
    } catch (err) {
      alert('Hata oluştu!');
    }
  };

  if (loading) return <div className="p-4">Yükleniyor...</div>;

  return (
<>
    <AdminSidebar />
    <div style={{ width: '75%', marginLeft: 'auto', padding: '1rem' }}>
         <div style={{ backgroundColor: 'rgba(249, 250, 251, 0.7)', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Site Ayarları Paneli</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('site')} className={activeTab === 'site' ? 'tab active' : 'tab'}>Site Ayarları</button>
        <button onClick={() => setActiveTab('social')} className={activeTab === 'social' ? 'tab active' : 'tab'}>Sosyal Medya</button>
        <button onClick={() => setActiveTab('api')} className={activeTab === 'api' ? 'tab active' : 'tab'}>API Uç Noktaları</button>
      </div>

      {activeTab === 'site' && (
        <div className="box">
          <input name="siteName" value={settings.siteName} onChange={handleChange} placeholder="Site Adı" className="input" />
          <input name="frontendUrl" value={settings.frontendUrl} onChange={handleChange} placeholder="Frontend URL" className="input" />
          <input name="apiUrl" value={settings.apiUrl} onChange={handleChange} placeholder="API URL" className="input" />

          <input value={settings.mailSettings?.email || ''} onChange={e => setSettings(prev => ({ ...prev, mailSettings: { ...prev.mailSettings, email: e.target.value } }))} placeholder="Mail" className="input" />

          <input type="password" value={settings.mailSettings?.password || ''} onChange={e => setSettings(prev => ({ ...prev, mailSettings: { ...prev.mailSettings, password: e.target.value } }))} placeholder="Mail Şifresi" className="input" />

          <select name="defaultLanguage" value={settings.defaultLanguage} onChange={handleChange} className="input">
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>

          <label style={{ marginTop: '1rem', display: 'flex', alignItems: 'stretch', flexDirection: 'row-reverse' }}>
            <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))} /> Bakım Modu
          </label>

          <input name="contactPhone" value={settings.contactPhone || ''} onChange={handleChange} placeholder="Telefon" className="input" />
          <input name="contactAddress" value={settings.contactAddress || ''} onChange={handleChange} placeholder="Adres" className="input" />
        </div>
      )}

      {activeTab === 'social' && (
        <div className="box">
          <input name="facebook" value={settings.socialLinks?.facebook || ''} onChange={e => setSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, facebook: e.target.value } }))} placeholder="Facebook" className="input" />
          <input name="twitter" value={settings.socialLinks?.twitter || ''} onChange={e => setSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, twitter: e.target.value } }))} placeholder="Twitter" className="input" />
        </div>
      )}

      {activeTab === 'api' && (
        <div className="box">
          {settings.apiEndpoints?.map((api, index) => (
            <div key={index} className="api-row">
              <input placeholder="Adı" value={api.name} onChange={(e) => handleApiChange(index, 'name', e.target.value)} className="input" />
             
              <input placeholder="Yol" value={api.path} onChange={(e) => handleApiChange(index, 'path', e.target.value)} className="input" />
              {/* <input placeholder="Yöntem" value={api.method} onChange={(e) => handleApiChange(index, 'method', e.target.value)} className="input" /> */}
             
            <select
  value={api.method}
  onChange={(e) => handleApiChange(index, 'method', e.target.value)}
  className="input" style={{ width: 'fit-content', minWidth: '100px' }}
>
  <option value="">Yöntem Seçin</option>
  <option value="GET">GET</option>
  <option value="POST">POST</option>
  <option value="PUT">PUT</option>
  <option value="DELETE">DELETE</option>
  <option value="PATCH">PATCH</option>
</select>


              <input placeholder="Açıklama" value={api.description} onChange={(e) => handleApiChange(index, 'description', e.target.value)} className="input" />
              <button onClick={() => removeApiEndpoint(index)} className="delete">Sil</button>
            </div>
          ))}
          <button onClick={addApiEndpoint} className="add">Yeni API Ekle</button>
        </div>
        
      )}

      <button onClick={handleSave} className="save">Kaydet</button>


      </div>
       </div>
       </>
  );
};

export default SiteSettingsPage;
