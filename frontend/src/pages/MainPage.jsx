import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  useScrollTrigger,
  Zoom,
  Fab,
  useMediaQuery,
} from '@mui/material';
import { styled, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import {
  FaStore,
  FaGlobe,
  FaMobileAlt,
  FaLock,
  FaClipboardList,
} from 'react-icons/fa';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

// Neon renkler
const neonGreen = '#39ff14';
const neonRed = '#ff073a';

// Koyu mavi tonları (arka plan ve buton için)
const backgroundMain = '#0e1a2b'; // Anasayfa arka planı
const buttonBg = '#162f4a'; // Buton için biraz daha açık koyu mavi (arkaplandan ton farkı)

// Koyu tema
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: backgroundMain,
      paper: '#112240',
    },
    primary: {
      main: '#2196f3',
    },
    success: {
      main: neonGreen,
      contrastText: '#000',
    },
    error: {
      main: neonRed,
      contrastText: '#000',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: {
      fontWeight: '900',
      letterSpacing: '0.1em',
      textShadow: `
        0 0 8px ${neonGreen}, 
        0 0 20px ${neonGreen}, 
        0 0 30px ${neonGreen}, 
        0 0 40px ${neonGreen}
      `,
      animation: 'flicker 3s infinite alternate',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          backgroundColor: buttonBg,
          color: '#e0e0e0',
          boxShadow: `0 0 10px 3px rgba(57, 255, 20, 0.6)`,
          transition: 'box-shadow 1s ease-in-out, background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#1f4571',
            boxShadow: `0 0 20px 6px ${neonGreen}`,
          },
        },
        containedSuccess: {
          boxShadow: `0 0 8px 3px ${neonGreen}`,
          animation: 'rotateGlow 4s linear infinite',
          backgroundColor: buttonBg,
          '&:hover': {
            backgroundColor: '#1f4571',
          },
        },
        containedError: {
          boxShadow: `0 0 8px 3px ${neonRed}`,
          animation: 'rotateGlowRed 4s linear infinite',
          backgroundColor: buttonBg,
          '&:hover': {
            backgroundColor: '#4a1520',
          },
        },
      },
    },
  },
});

// Açık tema
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f0f0f0',
      paper: '#fff',
    },
    primary: {
      main: '#1976d2',
    },
    success: {
      main: '#4caf50',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      contrastText: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: {
      fontWeight: '900',
      color: '#1976d2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          backgroundColor: '#e0e0e0',
          color: '#000',
          boxShadow: 'none',
          transition: 'box-shadow 1s ease-in-out, background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#a5d6f9',
            boxShadow: 'none',
          },
        },
        containedSuccess: {
          boxShadow: 'none',
          backgroundColor: '#4caf50',
          '&:hover': {
            backgroundColor: '#388e3c',
          },
        },
        containedError: {
          boxShadow: 'none',
          backgroundColor: '#f44336',
          '&:hover': {
            backgroundColor: '#d32f2f',
          },
        },
      },
    },
  },
});

// Global stil ve animasyonlar
const GlobalStyles = styled('style')`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap');

  @keyframes flicker {
    0%,
    100% {
      text-shadow: 0 0 8px ${neonGreen}, 0 0 20px ${neonGreen}, 0 0 30px ${neonGreen};
    }
    50% {
      text-shadow: 0 0 10px ${neonGreen}, 0 0 25px ${neonGreen}, 0 0 40px ${neonGreen};
    }
  }

  @keyframes rotateGlow {
    0% {
      box-shadow: 0 0 8px 3px ${neonGreen};
    }
    50% {
      box-shadow: 0 0 20px 6px ${neonGreen};
    }
    100% {
      box-shadow: 0 0 8px 3px ${neonGreen};
    }
  }

  @keyframes rotateGlowRed {
    0% {
      box-shadow: 0 0 8px 3px ${neonRed};
    }
    50% {
      box-shadow: 0 0 20px 6px ${neonRed};
    }
    100% {
      box-shadow: 0 0 8px 3px ${neonRed};
    }
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  @keyframes blinkCaret {
    0%, 100% { border-color: transparent; }
    50% { border-color: ${neonGreen}; }
  }

  .typing-animation {
    font-family: 'Dancing Script', cursive;
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid ${neonGreen};
    width: 0;
    animation: typing 3s steps(30, end) forwards, blinkCaret 0.75s step-end infinite;
  }
`;

function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });

  const handleClick = (event) => {
    const anchor =
      (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

const NeonFeatureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '20px',
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: `0 0 15px 5px rgba(33, 150, 243, 0.9)`,
  fontWeight: 600,
  fontSize: '1.15rem',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

export default function MainPage() {
  const { t } = useTranslation();

  const [darkMode, setDarkMode] = React.useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box id="back-to-top-anchor" />

        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              position: 'relative',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {/* Dil Seçici - Mobilde sol üstte sabit */}
            {isMobile && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  zIndex: 1100,
                }}
              >
                <LanguageSelector />
              </Box>
            )}

            {/* Logo */}
            <Box
              sx={{
                flexGrow: isMobile ? 1 : 0,
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'flex-start',
                order: isMobile ? 1 : 0,
                width: isMobile ? '100%' : 'auto',
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', color: neonGreen }}
                className="typing-animation"
              >
                urunler.com
              </Typography>
            </Box>

            {/* Butonlar */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: isMobile ? 'center' : 'flex-end',
                order: isMobile ? 2 : 1,
                width: isMobile ? '100%' : 'auto',
                mt: isMobile ? 2 : 0,
              }}
            >
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="success" sx={{ minWidth: 100 }}>
                  {t('mainPage.register')}
                </Button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="success" sx={{ minWidth: 100 }}>
                  {t('mainPage.login')}
                </Button>
              </Link>
            </Box>

            {/* Dil Seçici - Masaüstünde sağda (isteğe bağlı, dilersen kaldırabilirsin) */}
            {!isMobile && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                }}
              >
                <LanguageSelector />
              </Box>
            )}
          </Box>

          {/* Hero */}
          <Box
            sx={{
              textAlign: 'center',
              mb: 6,
              animation: 'slideDown 1s ease forwards',
              '@keyframes slideDown': {
                from: { opacity: 0, transform: 'translateY(-30px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{ fontWeight: '900', color: neonGreen, mb: 2 }}
              className="typing-animation"
            >
              {t('mainPage.title')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              maxWidth={600}
              mx="auto"
              sx={{ px: { xs: 2, sm: 0 } }}
            >
              {t('mainPage.subtitle')}
            </Typography>
          </Box>

          {/* Features */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ mb: 3, color: neonGreen, textAlign: 'center' }}
              className="typing-animation"
            >
              {t('mainPage.featuresTitle')}
            </Typography>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="stretch"
              sx={{ px: { xs: 2, sm: 0 } }}
            >
              {[
                { icon: <FaStore size={24} />, text: t('mainPage.feature1') },
                { icon: <FaClipboardList size={24} />, text: t('mainPage.feature2') },
                { icon: <FaGlobe size={24} />, text: t('mainPage.feature3') },
                { icon: <FaLock size={24} />, text: t('mainPage.feature4') },
                { icon: <FaMobileAlt size={24} />, text: t('mainPage.feature5') },
              ].map(({ icon, text }, idx) => (
                <Grid
                  key={idx}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <NeonFeatureBox>
                    {icon} {text}
                  </NeonFeatureBox>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 2, color: neonGreen }}
              className="typing-animation"
            >
              {t('mainPage.ctaTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 600, mx: 'auto', px: { xs: 2, sm: 0 } }}
            >
              {t('mainPage.ctaText')}
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="large"
              sx={{
                px: 5,
                fontWeight: 'bold',
                animation: 'rotateGlow 4s linear infinite',
                backgroundColor: buttonBg,
                boxShadow: `0 0 15px 5px ${neonGreen}`,
                '&:hover': {
                  backgroundColor: '#1f4571',
                  boxShadow: `0 0 30px 10px ${neonGreen}`,
                },
              }}
            >
              {t('mainPage.register')}
            </Button>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              textAlign: 'center',
              py: 3,
              borderTop: '1px solid #2196f3',
              color: '#777',
            }}
          >
            <Typography variant="body2">{t('mainPage.footerAbout')}</Typography>
            <Typography variant="body2">{t('mainPage.footerContact')}</Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              © 2025 urunler.com - {t('mainPage.footerRights')}
            </Typography>
          </Box>
        </Container>

        {/* Scroll Top */}
        <ScrollTop>
          <Fab
            color="success"
            size="small"
            aria-label="scroll back to top"
            sx={{
              animation: 'rotateGlow 4s linear infinite',
              backgroundColor: buttonBg,
              boxShadow: `0 0 10px 3px ${neonGreen}`,
              '&:hover': {
                backgroundColor: '#1f4571',
                boxShadow: `0 0 25px 7px ${neonGreen}`,
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>

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
      </Box>
    </ThemeProvider>
  );
}
