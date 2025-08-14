// pages/MainPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Fab, Button, Tooltip } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { keyframes } from '@mui/system';
import { Link } from 'react-router-dom';

import HeroSection from '../components/HeroSection';
import FeatureDetailSection from '../components/FeatureDetail';
import PricingSection from '../components/PricingSection';
import FooterSection from '../components/Footer';
import SectionIndicator from '../components/SectionIndicator';

// ---- Tema ayarları ----
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#111111',
      paper: '#1e1e1e',
    },
    primary: { main: '#00ff99' },
    secondary: { main: '#00ff99' },
    text: {
      primary: '#e0e0e0',
      secondary: '#aaa',
    },
    neon: { main: '#00ff99' },
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundColor: '#1e1e1e' } },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundColor: '#121212' } },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    primary: { main: '#1976d2' },
    secondary: { main: '#00ff99' },
    text: {
      primary: '#212121',
      secondary: '#555',
    },
    neon: { main: '#00ff99' },
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundColor: '#ffffff' } },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundColor: '#f5f5f5' } },
    },
  },
});

// ---- Shake animasyonu ----
const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
  100% { transform: translateX(0); }
`;

export default function MainPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [signupTooltip, setSignupTooltip] = useState('Hemen ücretsiz üyelik oluşturun');
  const [shake, setShake] = useState(false);

  const sectionRefs = useRef([]);
  const isScrolling = useRef(false);
  const activeRef = useRef(0);
  const touchStartY = useRef(0);

  // 5 saniye sonra tooltip değiştir ve titret
  useEffect(() => {
    const timer = setTimeout(() => {
      setSignupTooltip('Hadi ücretsiz web sayfanı oluştur');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { component: <HeroSection />, id: 'hero' },
    { component: <FeatureDetailSection feature="Kolay Mağaza Kurulumu" />, id: 'feature-1' },
    { component: <FeatureDetailSection feature="Ürün ve Sipariş Takibi" />, id: 'feature-2' },
    { component: <FeatureDetailSection feature="Çok Dilli Destek" />, id: 'feature-3' },
    { component: <FeatureDetailSection feature="Güvenli Ödeme Altyapısı" />, id: 'feature-4' },
    { component: <PricingSection />, id: 'pricing' },
    { component: <FooterSection />, id: 'footer' },
  ];

  const scrollToSection = (index) => {
    if (isScrolling.current) return;
    const ref = sectionRefs.current[index];
    if (!ref) return;

    isScrolling.current = true;
    activeRef.current = index;
    setActiveSection(index);
    ref.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      isScrolling.current = false;
    }, 700);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (isScrolling.current) return;
    if (e.deltaY > 0) {
      scrollToSection(Math.min(activeRef.current + 1, sections.length - 1));
    } else if (e.deltaY < 0) {
      scrollToSection(Math.max(activeRef.current - 1, 0));
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY.current - touchEndY;
    if (Math.abs(delta) < 50) return;

    if (delta > 0) {
      scrollToSection(Math.min(activeRef.current + 1, sections.length - 1));
    } else {
      scrollToSection(Math.max(activeRef.current - 1, 0));
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {/* Sağ üst butonlar */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1300,
          display: 'flex',
          gap: 1,
        }}
      >
        <Tooltip title="Hesabınıza giriş yaparak mağazanızı yönetin" arrow>
         <Button
  component={Link}

  to="/login"
  onClick={() => setShake(true)}
  onMouseLeave={() => setShake(false)}
  
  variant="contained"
  sx={{
    backgroundColor: 'background.paper',
    color: 'primary.main',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '20px',
    px: 2,
    boxShadow: 2,
    '&:hover': { backgroundColor: 'grey.300' },
  }}
>
  Giriş Yap
</Button>
        </Tooltip>

        <Tooltip title={signupTooltip} arrow>
          <Button
          component={Link}
  to="/register"
            onClick={() => setShake(true)}
            onMouseLeave={() => setShake(false)}
  variant="contained"
           
            color="primary"
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '20px',
              px: 2.5,
              boxShadow: 4,
              transition: 'all 0.2s ease',
              animation: shake ? `${shakeAnimation} 0.6s` : 'none',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            Üye Ol
          </Button>
        </Tooltip>
      </Box>

      {sections.map((section, idx) => (
        <Box
          key={idx}
          id={`section-${idx}`}
          ref={(el) => (sectionRefs.current[idx] = el)}
          sx={{
            height: { xs: 'auto', md: '100vh' },
            minHeight: '100vh',
            width: '100%',
            scrollSnapAlign: 'start',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            bgcolor: 'background.default',
          }}
        >
          {section.component}
        </Box>
      ))}

      {/* Section indicator sadece desktopta */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SectionIndicator
          sectionCount={sections.length}
          active={activeSection}
          onNavigate={scrollToSection}
        />
      </Box>

      {/* Tema butonu */}
      <Box sx={{ position: 'fixed', bottom: 32, left: 32, zIndex: 1200 }}>
        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          color="primary"
          size="large"
          sx={{
            backgroundColor: 'background.paper',
            '&:hover': { backgroundColor: 'grey.300' },
          }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* Yukarı çık butonu */}
      <Fab
        color="primary"
        size="small"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => scrollToSection(0)}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </ThemeProvider>
  );
}
