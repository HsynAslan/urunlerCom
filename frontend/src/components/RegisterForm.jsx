import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Spinner from '../components/Spinner';

const RegisterForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isSeller: false,
    isCustomer: false,
  });

  const [modalType, setModalType] = useState(null); // "seller" veya "customer"
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const termsRef = useRef(null);

  // Satıcı checkbox
  const handleSellerClick = (e) => {
    const checked = e.target.checked;
    if (checked && !termsAccepted) {
      e.preventDefault();
      setModalType("seller");
      setShowTermsModal(true);
    } else {
      setFormData(prev => ({
        ...prev,
        isSeller: checked,
        isCustomer: false,
      }));
    }
  };

  // Müşteri checkbox
  const handleCustomerClick = (e) => {
    const checked = e.target.checked;
    if (checked && !termsAccepted) {
      e.preventDefault();
      setModalType("customer");
      setShowTermsModal(true);
    } else {
      setFormData(prev => ({
        ...prev,
        isCustomer: checked,
        isSeller: false,
      }));
    }
  };

  // Modal açıldığında onay sıfırla
  useEffect(() => {
    if (showTermsModal) setTermsAccepted(false);
  }, [showTermsModal]);

  const handleAcceptTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleCloseModal = () => {
    if (!termsAccepted) {
      alert(t('RegisterPage.pleaseAcceptTerms'));
      return;
    }

    if (modalType === 'seller') {
      setFormData(prev => ({ ...prev, isSeller: true, isCustomer: false }));
    } else if (modalType === 'customer') {
      setFormData(prev => ({ ...prev, isCustomer: true, isSeller: false }));
    }

    setShowTermsModal(false);
    setModalType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = { ...formData };

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/auth/register`;
      const response = await axios.post(url, dataToSend);

      setLoading(false);
      setShowVerificationModal(true);

      setFormData({
        name: '',
        email: '',
        password: '',
        isSeller: false,
        isCustomer: false,
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
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t('RegisterPage.email')}
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t('RegisterPage.password')}
          value={formData.password}
          onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

        <label className="seller-checkbox">
          <input
            type="checkbox"
            name="isCustomer"
            checked={formData.isCustomer}
            onChange={handleCustomerClick}
          />
          {t('RegisterPage.isCustomer')}
        </label>

        <button type="submit">{t('RegisterPage.registerButton')}</button>
      </form>

      {/* Hizmet Şartları Modalı */}
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

      {/* Doğrulama modalı */}
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
