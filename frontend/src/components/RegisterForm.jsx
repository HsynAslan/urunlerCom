import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Spinner from '../components/Spinner'; // Spinner dosyanın yoluna göre ayarla

const RegisterForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isSeller: false,
  });

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Spinner durumu için yeni state
  const [loading, setLoading] = useState(false);

  const termsRef = useRef(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSellerClick = e => {
    if (!formData.isSeller && !termsAccepted) {
      e.preventDefault();
      setShowTermsModal(true);
    } else {
      setFormData(prev => ({ ...prev, isSeller: e.target.checked }));
    }
  };

  useEffect(() => {
    if (showTermsModal) setTermsAccepted(false);
  }, [showTermsModal]);

  const handleAcceptTermsChange = e => {
    setTermsAccepted(e.target.checked);
  };

  const handleCloseModal = () => {
    if (termsAccepted) {
      setFormData(prev => ({ ...prev, isSeller: true }));
      setShowTermsModal(false);
    } else {
      alert(t('RegisterPage.pleaseAcceptTerms'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Spinner başlat
    setLoading(true);

    try {
      const url = 'http://localhost:5000/api/auth/register';
      const response = await axios.post(url, formData);

      // Spinner durdur (mail gönderildi popup öncesi)
      setLoading(false);

      // İstek başarılı, doğrulama modalını aç
      setShowVerificationModal(true);

      // İstersen formu sıfırlayabilirsin
      setFormData({
        name: '',
        email: '',
        password: '',
        isSeller: false,
      });
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || 'Bir hata oluştu');
    }
  };

  return (
    <>
      {loading && <Spinner />}

      <form onSubmit={handleSubmit} className="register-form">
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

        <label className="seller-checkbox">
          <input
            type="checkbox"
            name="isSeller"
            checked={formData.isSeller}
            onChange={handleSellerClick}
          />
          {t('RegisterPage.isSeller')}
        </label>

        <button type="submit">{t('RegisterPage.registerButton')}</button>
      </form>

      {/* Hizmet şartları modalı */}
      {showTermsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{t('RegisterPage.termsTitle')}</h2>
            <div
              className="terms-text"
              ref={termsRef}
              style={{
                height: '200px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
              }}
            >
              {t('RegisterPage.termsText')}
            </div>

            <label style={{ display: 'block', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={handleAcceptTermsChange}
              />{' '}
              {t('RegisterPage.acceptTerms')}
            </label>

            <button
              disabled={!termsAccepted}
              onClick={handleCloseModal}
              style={{ marginRight: '10px' }}
            >
              {t('RegisterPage.confirm')}
            </button>

            <button onClick={() => setShowTermsModal(false)}>
              {t('RegisterPage.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Doğrulama maili gönderildi modalı */}
      {showVerificationModal && (
        <div className="modal-overlay">
          <div className="modal-content verification-modal">
            <h2>{t('RegisterPage.verificationSentTitle')}</h2>

            <div className="mail-animation" style={{ margin: '20px auto' }}>
              <video
                src="/images/mail-send.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <p>{t('RegisterPage.verificationSentMessage')}</p>

            <button onClick={() => setShowVerificationModal(false)}>{t('RegisterPage.ok')}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterForm;
