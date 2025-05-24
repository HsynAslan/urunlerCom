import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isSeller: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Basit şifre eşleşme kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError(t('RegisterPage.passwordMismatch') || 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isSeller: formData.isSeller,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Kayıt sırasında hata oluştu');
      } else {
        console.log('Registration successful:', data);
        // TODO: token kaydet ve yönlendirme yap
      }
    } catch (err) {
      setError(err.message || 'Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder={t('RegisterPage.name')}
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder={t('RegisterPage.email')}
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder={t('RegisterPage.password')}
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder={t('RegisterPage.confirmPassword')}
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <label>
        <input
          type="checkbox"
          name="isSeller"
          checked={formData.isSeller}
          onChange={handleChange}
        />
        {t('RegisterPage.isSeller')}
      </label>

      <button type="submit" disabled={loading}>
        {loading ? t('RegisterPage.registering') : t('RegisterPage.registerButton')}
      </button>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default RegisterForm;
