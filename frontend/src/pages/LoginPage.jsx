// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';
import LanguageSelector from '../components/LanguageSelector';

import { Box, Fab, Zoom, Button } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useScrollTrigger } from '@mui/material';

// Scroll to top butonu bileşeni
function ScrollTop() {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });

  const handleClick = () => {
    const anchor = document.querySelector('#back-to-top-anchor');
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 80, right: 32, zIndex: 1000 }}
      >
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
}

const buttonBgDark = '#162f4a';   // mainPage’den koyu tema buton arkaplanı
const neonGreen = '#39ff14';

const LoginPage = () => {
  const { t } = useTranslation();

  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <div id="back-to-top-anchor" />
      <div className="login-page-container" style={{ position: 'relative', minHeight: '100vh' }}>
        <div className="language-selector-container" style={{ position: 'absolute', top: 16, left: 16, zIndex: 1100 }}>
          <LanguageSelector />
        </div>

        <div className="login-card" style={{ maxWidth: 400, margin: '100px auto 40px', padding: 24, borderRadius: 12, boxShadow: darkMode ? `0 0 20px 3px ${neonGreen}` : '0 0 10px rgba(0,0,0,0.1)', backgroundColor: darkMode ? buttonBgDark : '#fff', color: darkMode ? '#e0e0e0' : '#000' }}>
          <h2 className="login-title" style={{ textAlign: 'center', marginBottom: 24 }}>
            {t('LoginPage.title')}
          </h2>
          <LoginForm />
          <div className="login-extra" style={{ marginTop: 16, textAlign: 'center' }}>
            <a href="/forgot-password" className="forgot-password" style={{ color: darkMode ? neonGreen : '#1976d2', textDecoration: 'none' }}>
              {t('LoginPage.forgotPassword')}
            </a>
            <p className="no-account" style={{ marginTop: 16 }}>
              {t('LoginPage.noAccount')}{' '}
              <a href="/register" className="register-link" style={{ color: darkMode ? neonGreen : '#1976d2', textDecoration: 'none' }}>
                {t('LoginPage.registerNow')}
              </a>
            </p>
          </div>
        </div>

        {/* Scroll to top button */}
        <ScrollTop />

        {/* Tema değiştirici buton (sol altta) */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            left: 32,
            zIndex: 1200,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              fontWeight: 'bold',
              backgroundColor: darkMode ? buttonBgDark : '#e0e0e0',
              color: darkMode ? '#e0e0e0' : '#000',
              boxShadow: darkMode ? `0 0 10px 3px ${neonGreen}` : 'none',
              minWidth: 40,
              minHeight: 40,
              borderRadius: '50%',
              p: 1,
              '&:hover': {
                backgroundColor: darkMode ? '#1f4571' : '#a5d6f9',
              },
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </Button>
        </Box>
      </div>
    </>
  );
};

export default LoginPage;
