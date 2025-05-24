import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaStore, FaGlobe, FaMobileAlt, FaLock, FaClipboardList, FaLanguage } from 'react-icons/fa';
import '../styles/MainPage.css'; // CSS dosyasını import et
import { Link } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';
const MainPage = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="logo">urunler.com</div>
        
        <div className="auth-buttons">
       <Link to="/login">
            <button className="login-btn">{t('mainPage.login')}</button>
          </Link>
          <Link to="/register">
            <button className="register-btn">{t('mainPage.register')}</button>
          </Link>
        </div>
        <div className="language-selector-container">
        <LanguageSelector />
      </div>
      </header>

      <section className="hero-section">
        <h1>{t('mainPage.title')}</h1>
        <p>{t('mainPage.subtitle')}</p>
      </section>

      <section className="features-section">
        <h2>{t('mainPage.featuresTitle')}</h2>
        <div className="features">
          <div className="feature-box"><FaStore /> {t('mainPage.feature1')}</div>
          <div className="feature-box"><FaClipboardList /> {t('mainPage.feature2')}</div>
          <div className="feature-box"><FaGlobe /> {t('mainPage.feature3')}</div>
          <div className="feature-box"><FaLock /> {t('mainPage.feature4')}</div>
          <div className="feature-box"><FaMobileAlt /> {t('mainPage.feature5')}</div>
        </div>
      </section>

      <section className="cta-section">
        <h3>{t('mainPage.ctaTitle')}</h3>
        <p>{t('mainPage.ctaText')}</p>
        <button className="register-btn big">{t('mainPage.register')}</button>
      </section>

      <footer className="main-footer">
        <p>{t('mainPage.footerAbout')}</p>
        <p>{t('mainPage.footerContact')}</p>
        <small>© 2025 urunler.com - {t('mainPage.footerRights')}</small>
      </footer>
    </div>
  );
};

export default MainPage;
