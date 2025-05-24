// src/pages/RegisterPage.jsx
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import '../styles/LoginPage.css'; // aynı tasarımı kullanmak için
import '../styles/RegisterPage.css';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <div>
<div className="login-page-container">
      {/* Sağ üstte dil seçici */}
      <div className="language-selector-container">
        <LanguageSelector />
      </div>

      <div className="login-card">
        <h2 className="login-title">{t('RegisterPage.title')}</h2>
        <RegisterForm />

        <div className="login-extra">
          <p className="no-account">
            {t('RegisterPage.alreadyHaveAccount')}{' '}
            <a href="/login" className="register-link">
              {t('RegisterPage.loginNow')}
            </a>
          </p>
        </div>
      </div>
    </div>



    </div>
    
  );
};

export default RegisterPage;
