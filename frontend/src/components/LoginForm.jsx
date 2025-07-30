import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ⬅️ yönlendirme için
import '../styles/LoginForm.css';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // ⬅️ yönlendirme fonksiyonu

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/auth/login`, formData);
      const { token, user } = res.data;

      // TODO: Token'ı localStorage vs. saklamak istersen:
      localStorage.setItem('token', token);

      // 👇 Yönlendirme mantığı:
      if (user.isSeller) {
        navigate('/seller/dashboard'); // satıcı sayfası
      } else if (user.isCustomer) {
        navigate('/customer/home'); // müşteri sayfası
      } else {
        navigate('/'); // fallback yönlendirme
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        name="email"
        placeholder={t('LoginPage.email')}
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder={t('LoginPage.password')}
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">{t('LoginPage.loginButton')}</button>
      {error && <p className="login-error">{error}</p>}
    </form>
  );
};

export default LoginForm;
