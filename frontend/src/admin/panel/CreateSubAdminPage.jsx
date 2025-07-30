import React, { useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
const rolesList = [
  'manage_admins',
  'edit_site_settings',
  'manage_users',
  'view_everything',
  'edit_theme',
  'super_admin'
];

const CreateSubAdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [message, setMessage] = useState('');

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/subadmin`, 
        { username, password, roles: selectedRoles }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Alt admin başarıyla oluşturuldu!');
      setUsername('');
      setPassword('');
      setSelectedRoles([]);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Bir hata oluştu');
    }
  };

  return (
    <>
    <AdminSidebar />
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Alt Admin Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Kullanıcı Adı:</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Şifre:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Roller:</label>
          {rolesList.map(role => (
            <div key={role}>
              <input 
                type="checkbox" 
                id={role} 
                checked={selectedRoles.includes(role)} 
                onChange={() => toggleRole(role)} 
              />
              <label htmlFor={role}>{role}</label>
            </div>
          ))}
        </div>

        <button type="submit">Oluştur</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </>
  );
};

export default CreateSubAdminPage;
