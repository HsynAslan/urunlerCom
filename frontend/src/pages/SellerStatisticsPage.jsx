import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Fab,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DownloadIcon from '@mui/icons-material/Download';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#101a27', paper: '#1c2b3a' },
    text: { primary: '#c3e8ff', secondary: '#88aabb' },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f4f6f9', paper: '#ffffff' },
    text: { primary: '#2f3e46', secondary: '#607d8b' },
  },
});

// metricMeta objesindeki label ve tooltip artık i18n’den alınacak
const metricMeta = (t) => ({
  totalProducts: {
    label: t('sellerStatistics.totalProducts'),
    icon: <StorefrontIcon fontSize="large" color="primary" />,
    color: 'primary.main',
    tooltip: t('sellerStatistics.tooltip.totalProducts'),
  },
  totalSales: {
    label: t('sellerStatistics.totalSales'),
    icon: <ShoppingCartIcon fontSize="large" color="success" />,
    color: 'success.main',
    tooltip: t('sellerStatistics.tooltip.totalSales'),
  },
  totalRevenue: {
    label: t('sellerStatistics.totalRevenue'),
    icon: <MonetizationOnIcon fontSize="large" color="warning" />,
    color: 'warning.main',
    tooltip: t('sellerStatistics.tooltip.totalRevenue'),
  },
  totalVisits: {
    label: t('sellerStatistics.totalVisits'),
    icon: <StorefrontIcon fontSize="large" color="info" />,
    color: 'info.main',
    tooltip: t('sellerStatistics.tooltip.totalVisits'),
  },
  phoneClicks: {
    label: t('sellerStatistics.phoneClicks'),
    icon: <PhoneIcon fontSize="large" color="error" />,
    color: 'error.main',
    tooltip: t('sellerStatistics.tooltip.phoneClicks'),
  },
  locationClicks: {
    label: t('sellerStatistics.locationClicks'),
    icon: <LocationOnIcon fontSize="large" color="secondary" />,
    color: 'secondary.main',
    tooltip: t('sellerStatistics.tooltip.locationClicks'),
  },
  qrDownloads: {
    label: t('sellerStatistics.qrDownloads'),
    icon: <DownloadIcon fontSize="large" color="success" />,
    color: 'success.main',
    tooltip: t('sellerStatistics.tooltip.qrDownloads'),
  },
  ordersPlaced: {
    label: t('sellerStatistics.ordersPlaced'),
    icon: <ShoppingCartIcon fontSize="large" color="primary" />,
    color: 'primary.main',
    tooltip: t('sellerStatistics.tooltip.ordersPlaced'),
  },
  averageDuration: {
    label: t('sellerStatistics.averageDuration'),
    icon: <AccessTimeIcon fontSize="large" color="info" />,
    color: 'info.main',
    tooltip: t('sellerStatistics.tooltip.averageDuration'),
  },
});

const formatValue = (key, value) => {
  if (key === 'totalRevenue') {
    return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  }
  if (key === 'averageDuration') {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}dk ${seconds}sn`;
  }
  return value.toLocaleString ? value.toLocaleString('tr-TR') : value;
};

const SellerStatisticsPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/fullstats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        toast.error('❌ ' + (t('sellerStatistics.fetchError') || 'Error loading statistics'));
      });
  }, [t]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const maxDurationSeconds = 300;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative',
        }}
      >
        {/* Masaüstü Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: '20%',
              bgcolor: 'background.paper',
              borderRight: `2px solid ${darkMode ? '#3f51b5' : '#cfd8dc'}`,
              p: 2,
            }}
          >
            <SellerSidebar />
          </Box>
        )}

        {/* Mobil Sidebar */}
        {isMobile && (
          <>
            <Fab
              color="primary"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2000,
              }}
              aria-label={t('sellerStatistics.menuToggle')}
            >
              <MenuIcon />
            </Fab>
            <SellerSidebar
              mobileOpen={mobileSidebarOpen}
              setMobileOpen={setMobileSidebarOpen}
              variant="temporary"
              PaperProps={{
                sx: {
                  width: '100%',
                  height: '100vh',
                  maxHeight: '100vh',
                  overflowY: 'auto',
                },
              }}
            />
          </>
        )}

        {/* İçerik */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: '80%' },
            position: 'relative',
          }}
        >
          {/* Dil seçici sağ üst köşede */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1500 }}>
            <LanguageSelector />
          </Box>

          {/* Sayfa başlığı */}
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            📊 {t('sellerStatistics.title')}
          </Typography>

          {/* Yükleniyor gösterge */}
          {!stats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress size={60} thickness={5} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {Object.entries(metricMeta(t)).map(([key, { label, icon, color, tooltip }]) => {
                if (!(key in stats)) return null;
                const value = stats[key];
                let progressPercent = 0;
                if (key === 'averageDuration') {
                  progressPercent = Math.min((value / maxDurationSeconds) * 100, 100);
                }
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Tooltip title={tooltip} arrow>
                      <Card
                        sx={{
                          bgcolor: 'background.paper',
                          height: '160px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          p: 2,
                          borderLeft: `8px solid`,
                          borderColor: color,
                          boxShadow: 3,
                        }}
                        elevation={4}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {icon}
                          <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                            {label}
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                          {formatValue(key, value)}
                        </Typography>
                        {key === 'averageDuration' ? (
                          <LinearProgress
                            variant="determinate"
                            value={progressPercent}
                            sx={{ height: 8, borderRadius: 4 }}
                            color="info"
                          />
                        ) : (
                          <Box sx={{ height: 8 }} />
                        )}
                      </Card>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Tema değiştirme butonu sol altta */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 32,
              left: 32,
              zIndex: 1600,
            }}
          >
            <Button
              onClick={toggleDarkMode}
              variant="contained"
              sx={{
                minWidth: 40,
                minHeight: 40,
                borderRadius: '50%',
                bgcolor: darkMode ? '#1c2b3a' : '#e0e0e0',
                color: darkMode ? '#90caf9' : '#000',
                boxShadow: darkMode ? '0 0 12px rgba(144,202,249,0.6)' : 'none',
                p: 0,
              }}
              aria-label={t('sellerStatistics.themeToggle')}
            >
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SellerStatisticsPage;
