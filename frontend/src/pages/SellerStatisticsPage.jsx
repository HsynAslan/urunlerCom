import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
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

const metricLabels = {
  totalProducts: 'Toplam Ürün Sayısı',
  totalSales: 'Toplam Satış Adedi',
  totalRevenue: 'Toplam Gelir (TL)',
  recentSalesCount: 'Son 30 Gün Satış Sayısı',
  // Buraya backend’den gelen başka metrikler de eklenebilir
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
      .get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error('❌ ' + (t('sellerStatistics.fetchError') || 'İstatistikler yüklenirken hata oluştu'));
      });
  }, [t]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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
              aria-label="Menu Aç/Kapat"
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
            📊 {t('sellerStatistics.title') || 'İstatistikler'}
          </Typography>

          {/* İstatistik Tablosu */}
          {!stats ? (
            <Typography>{t('sellerStatistics.loading') || 'Yükleniyor...'}</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('sellerStatistics.metric') || 'Ölçüt'}</TableCell>
                    <TableCell align="right">{t('sellerStatistics.value') || 'Değer'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(stats).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{metricLabels[key] || key}</TableCell>
                      <TableCell align="right">
                        {typeof value === 'number' && key === 'totalRevenue'
                          ? value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
                          : value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
              aria-label="Tema değiştir"
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
