import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isSeller: false,
  });

  // Modal görünürlüğü
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Modal içindeki "okudum" checkbox
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      e.preventDefault(); // Checkbox seçimini engelle
      setShowTermsModal(true);
    } else {
      setFormData(prev => ({ ...prev, isSeller: e.target.checked }));
    }
  };

  // Modal açılırken onay kaldır
  useEffect(() => {
    if (showTermsModal) {
      setTermsAccepted(false);
    }
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

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: kayıt işlemini backend'e gönder
  };

  return (
    <>
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
    </>
  );
};

export default RegisterForm;
