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
  IconButton,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Tema renkleri (rehberden)
const colors = {
  darkBg: '#121212',
  lightBg: '#f5f5f5',
  darkCardBg: '#1e1e1e',
  lightCardBg: '#ffffff',
  darkText: '#e0e0e0',
  lightText: '#212121',
  primary: '#1976d2',
  success: '#66bb6a',
  error: '#ef5350',
};

// Koyu tema
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.darkBg,
      paper: colors.darkCardBg,
    },
    primary: {
      main: colors.primary,
    },
    success: {
      main: colors.success,
      contrastText: '#000',
    },
    error: {
      main: colors.error,
      contrastText: '#000',
    },
    text: {
      primary: colors.darkText,
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: {
      fontWeight: '900',
      letterSpacing: '0.1em',
      color: colors.success,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'background-color 0.3s ease',
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          color: '#fff',
          '&:hover': {
            backgroundColor: '#115293',
          },
        },
        containedSuccess: {
          backgroundColor: colors.success,
          color: '#000',
          '&:hover': {
            backgroundColor: '#4caf50',
          },
        },
        containedError: {
          backgroundColor: colors.error,
          color: '#000',
          '&:hover': {
            backgroundColor: '#d32f2f',
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
      default: colors.lightBg,
      paper: colors.lightCardBg,
    },
    primary: {
      main: colors.primary,
    },
    success: {
      main: colors.success,
      contrastText: '#fff',
    },
    error: {
      main: colors.error,
      contrastText: '#fff',
    },
    text: {
      primary: colors.lightText,
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: {
      fontWeight: '900',
      color: colors.primary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'background-color 0.3s ease',
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          color: '#fff',
          '&:hover': {
            backgroundColor: '#115293',
          },
        },
        containedSuccess: {
          backgroundColor: colors.success,
          color: '#fff',
          '&:hover': {
            backgroundColor: '#4caf50',
          },
        },
        containedError: {
          backgroundColor: colors.error,
          color: '#fff',
          '&:hover': {
            backgroundColor: '#d32f2f',
          },
        },
      },
    },
  },
});

const ScrollTop = (props) => {
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
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
};

const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: '20px',
  borderRadius: 12,
  boxShadow: theme.shadows[4],
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontWeight: 600,
  fontSize: '1.1rem',
  cursor: 'default',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[8],
  },
}));

export default function MainPage() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = React.useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
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
              flexWrap: 'wrap',
              gap: 2,
              mb: 4,
              position: 'relative',
            }}
          >
            {/* Dil Seçici */}
            {isMobile ? (
              <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1100 }}>
                <LanguageSelector />
              </Box>
            ) : (
              <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
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
              <Typography variant="h4" sx={{ fontWeight: '900', color: colors.success }}>
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
                <Button variant="contained" color="primary" sx={{ minWidth: 100 }}>
                  {t('mainPage.login')}
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Hero */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{ fontWeight: '900', color: colors.success, mb: 2 }}
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
              sx={{ mb: 3, color: colors.success, textAlign: 'center' }}
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
                  <FeatureCard>
                    {icon} {text}
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, color: colors.success }}>
              {t('mainPage.ctaTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 600, mx: 'auto', px: { xs: 2, sm: 0 } }}
            >
              {t('mainPage.ctaText')}
            </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="success" sx={{ minWidth: 100 }}>
                {t('mainPage.register')}
              </Button>
            </Link>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              textAlign: 'center',
              py: 3,
              borderTop: `1px solid ${colors.primary}`,
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
            color="primary"
            size="small"
            aria-label="scroll back to top"
            sx={{}}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>

        {/* Tema değiştirici buton */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            left: 32,
            zIndex: 1200,
          }}
        >
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            color="primary"
            size="large"
            sx={{ backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'grey.300' } }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
