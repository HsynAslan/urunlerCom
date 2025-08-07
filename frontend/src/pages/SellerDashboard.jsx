import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  Button,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const defaultTheme = createTheme();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0e1a2b', paper: '#162f4a' },
    text: { primary: '#7effa2', secondary: '#a0d8c6' },
  },
  shadows: defaultTheme.shadows,
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f5f7fa', paper: '#fff' },
    text: { primary: '#004d40', secondary: '#00695c' },
  },
  shadows: defaultTheme.shadows,
});

const SellerDashboard = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = React.useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Mobilde sidebar görünürlüğü kontrolü
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const neonShadowColor = darkMode ? '#00ffd8' : '#00897b';

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Masaüstünde Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: '20%',
              bgcolor: 'background.paper',
              borderRight: `2px solid ${darkMode ? '#2196f3' : '#4db6ac'}`,
              p: 2,
              minHeight: '100vh',
              overflowY: 'visible',
              position: 'relative',
              zIndex: 1300,
            }}
          >
            <SellerSidebar />
          </Box>
        )}

        {/* Mobilde aç/kapa butonu */}
        {isMobile && (
          <Button
            variant="contained"
            onClick={() => setMobileSidebarOpen(true)}
            sx={{
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 2000,
              borderRadius: '8px',
              bgcolor: darkMode ? '#2196f3' : '#4db6ac',
              color: '#fff',
              textTransform: 'none',
            }}
          >
            Menü
          </Button>
        )}

        {/* İçerik */}
        <Box
          sx={{
            width: { },
            p: 3,
            position: 'relative',
            minHeight: '100vh',
            overflowY: 'auto',
            color: 'text.primary',
            textShadow: darkMode
              ? `0 0 8px ${neonShadowColor}, 0 0 20px ${neonShadowColor}`
              : 'none',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1500,
            }}
          >
            <LanguageSelector />
          </Box>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, textShadow: 'none' }}>
              {t('SellerDashboard.welcome')}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', maxWidth: 700, lineHeight: 1.6, textShadow: 'none' }}
            >
              {t('SellerDashboard.description')}
            </Typography>
          </Box>
        </Box>

        {/* Tema değiştirici */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            left: 32,
            zIndex: 1600,
          }}
        >
          <Button
            onClick={() => setDarkMode(!darkMode)}
            variant="contained"
            size="small"
            sx={{
              minWidth: 40,
              minHeight: 40,
              borderRadius: '50%',
              bgcolor: darkMode ? '#162f4a' : '#e0e0e0',
              color: darkMode ? '#00ffd8' : '#000',
              boxShadow: darkMode ? `0 0 10px 3px ${neonShadowColor}` : 'none',
              '&:hover': { bgcolor: darkMode ? '#1f4571' : '#a5d6f9' },
              p: 0,
            }}
            aria-label="toggle theme"
          >
            {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </Button>
        </Box>

        {/* Mobil drawer olarak sidebar */}
        {isMobile && (
          <SellerSidebar
            mobileOpen={mobileSidebarOpen}
            setMobileOpen={setMobileSidebarOpen}
            variant="temporary"
            anchor="left"
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default SellerDashboard;
