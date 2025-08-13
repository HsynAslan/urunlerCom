// pages/MainPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Fab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import HeroSection from '../components/HeroSection';
import FeaturesOverview from '../components/FeaturesOverview';
import FeatureDetailSection from '../components/FeatureDetail';
import PricingSection from '../components/PricingSection';
import FooterSection from '../components/Footer';
import SectionIndicator from '../components/SectionIndicator';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#111111', // sayfa arka planı
      paper: '#1e1e1e',   // kartlar, paper vb.
    },
    primary: { main: '#00ff99' }, // neon yeşil
    secondary: { main: '#00ff99' }, // gerekirse ikincil
    text: {
      primary: '#e0e0e0', // ana yazı
      secondary: '#aaa',  // açıklamalar, alt yazılar
    },
    neon: { main: '#00ff99' }, // özel neon renk (kart border, glow vb.)
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
        },
      },
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
    secondary: { main: '#00ff99' }, // neon vurgular light mode’da da
    text: {
      primary: '#212121',
      secondary: '#555',
    },
    neon: { main: '#00ff99' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

export default function MainPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);
  const isScrolling = useRef(false);
  const activeRef = useRef(0);
  const touchStartY = useRef(0);

  const sections = [
    { component: <HeroSection />, id: 'hero' },
    
    { component: <FeatureDetailSection feature="Kolay Mağaza Kurulumu" />, id: 'feature-1' },
    { component: <FeatureDetailSection feature="Ürün ve Sipariş Takibi" />, id: 'feature-2' },
    { component: <FeatureDetailSection feature="Çok Dilli Destek" />, id: 'feature-3' },
    { component: <FeatureDetailSection feature="Güvenli Ödeme Altyapısı" />, id: 'feature-4' },
    { component: <PricingSection />, id: 'pricing' },
    { component: <FooterSection />, id: 'footer' }, // footer en altta
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
      {sections.map((section, idx) => (
        <Box
          key={idx}
          id={`section-${idx}`}
          ref={(el) => (sectionRefs.current[idx] = el)}
          sx={{
            height: { xs: 'auto', md: '100vh' }, // mobilde içerik kadar, desktopta tam ekran
            minHeight: '100vh', // az içerik varsa bile tam ekran
            width: '100%',
            scrollSnapAlign: 'start',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
             bgcolor: 'background.default', // <-- burası dinamik
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
