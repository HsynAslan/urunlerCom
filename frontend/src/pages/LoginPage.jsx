// src/pages/LoginPage.jsx
import { useTranslation } from 'react-i18next';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';
import LanguageSelector from '../components/LanguageSelector';
const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div className="login-page-container">
       <div className="language-selector-container">
        <LanguageSelector />
      </div>
      <div className="login-card">
        <h2 className="login-title">{t('LoginPage.title')}</h2>
        <LoginForm />
        <div className="login-extra">
          <a href="/forgot-password" className="forgot-password">
            {t('LoginPage.forgotPassword')}
          </a>
          <p className="no-account">
            {t('LoginPage.noAccount')}{' '}
            <a href="/register" className="register-link">
              {t('LoginPage.registerNow')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
