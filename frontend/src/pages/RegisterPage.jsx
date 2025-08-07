import React, { useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Zoom,
  useScrollTrigger,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LanguageSelector from '../components/LanguageSelector';
import RegisterForm from '../components/RegisterForm';

const neonGreen = '#39ff14';
const backgroundPaper = '#112240';
const neonRed = '#ff073a';
const backgroundMain = '#0e1a2b';
const buttonBg = '#162f4a';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: backgroundMain, paper: '#112240' },
    primary: { main: '#2196f3' },
    success: { main: neonGreen, contrastText: '#000' },
    error: { main: neonRed, contrastText: '#000' },
    text: { primary: '#e0e0e0', secondary: '#bbb' },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h2: {
      fontWeight: 900,
      color: backgroundPaper,
      textShadow: `
        0 0 8px ${neonGreen},
        0 0 20px ${neonGreen},
        0 0 30px ${neonGreen}
      `,
      animation: 'flicker 3s infinite alternate',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f0f0f0', paper: '#fff' },
    primary: { main: '#1976d2' },
    success: { main: '#4caf50', contrastText: '#fff' },
    error: { main: '#f44336', contrastText: '#fff' },
    text: { primary: '#000', secondary: '#555' },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h2: {
      fontWeight: 900,
      color: backgroundPaper,
    },
  },
});

function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          py: 4,
          px: 2,
        }}
      >
        <Box id="back-to-top-anchor" />

        {/* Dil Seçici */}
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: isMobile ? 16 : 'auto',
            right: isMobile ? 'auto' : 16,
            zIndex: 1400,
          }}
        >
          <LanguageSelector />
        </Box>

        {/* Tema Değiştirici Buton */}
        <Box sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1400 }}>
        <Button
  variant="contained"
  onClick={() => setDarkMode(!darkMode)}
  sx={{
    fontWeight: 'bold',
    backgroundColor: darkMode ? buttonBg : '#e0e0e0',
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

        {/* Kayıt Formu */}
        <Container
          maxWidth="sm"
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: darkMode
              ? `0 0 20px 4px ${neonGreen}`
              : '0 0 10px rgba(0,0,0,0.1)',
            p: 4,
            mt: 10,
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
            {t('RegisterPage.title')}
          </Typography>

          <RegisterForm darkMode={darkMode} />


          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('RegisterPage.alreadyHaveAccount')}{' '}
              <a href="/login" style={{ color: neonGreen, fontWeight: 'bold' }}>
                {t('RegisterPage.loginNow')}
              </a>
            </Typography>
          </Box>
        </Container>

        {/* Scroll To Top Butonu */}
        <ScrollTop>
          <Button
            color="success"
            size="small"
            aria-label="scroll back to top"
            sx={{
              animation: darkMode ? 'rotateGlow 4s linear infinite' : 'none',
              backgroundColor: darkMode ? buttonBg : '#e0e0e0',
              boxShadow: darkMode ? `0 0 15px 4px ${neonGreen}` : 'none',
              '&:hover': {
                backgroundColor: darkMode ? '#1f4571' : '#a5d6f9',
                boxShadow: darkMode ? `0 0 25px 7px ${neonGreen}` : 'none',
              },
              borderRadius: '50%',
              minWidth: 40,
              minHeight: 40,
              padding: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <KeyboardArrowUpIcon />
          </Button>
        </ScrollTop>
      </Box>
    </ThemeProvider>
  );
}
