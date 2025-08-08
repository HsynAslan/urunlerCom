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
  TableContainer,
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

// Backend’den gelen key'leri okunabilir label'a çevir
const metricLabels = {
  totalProducts: 'Toplam Ürün Sayısı',
  totalSales: 'Toplam Satış Adedi',
  totalRevenue: 'Toplam Gelir',
  totalVisits: 'Toplam Ziyaret',
  phoneClicks: 'Telefon Aramaları',
  locationClicks: 'Harita Tıklamaları',
  qrDownloads: 'QR İndirilenler',
  ordersPlaced: 'Verilen Siparişler',
  averageDuration: 'Ortalama Sayfa Süresi',
};

const formatValue = (key, value) => {
  if (key === 'totalRevenue') {
    return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  }
  if (key === 'averageDuration') {
    // saniyeyi dakika ve saniyeye çevir (örn: 3dk 20sn)
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}dk ${seconds}sn`;
  }
  return value;
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

          {/* Yükleniyorsa */}
          {!stats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Mobilde kartlı özet */}
              {isMobile ? (
                <Grid container spacing={2}>
                  {Object.entries(stats).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Card
                        variant="outlined"
                        sx={{
                          bgcolor: 'background.paper',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          py: 3,
                          px: 1,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {metricLabels[key] || key}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatValue(key, value)}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                // Masaüstü için tablo
                <Paper>
                  <TableContainer>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: `2px solid ${theme.palette.divider}` }}>
                          <th
                            style={{
                              textAlign: 'left',
                              padding: '12px 16px',
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {t('sellerStatistics.metric') || 'Ölçüt'}
                          </th>
                          <th
                            style={{
                              textAlign: 'right',
                              padding: '12px 16px',
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {t('sellerStatistics.value') || 'Değer'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(stats).map(([key, value]) => (
                          <tr key={key} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <td style={{ padding: '12px 16px' }}>{metricLabels[key] || key}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              {formatValue(key, value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableContainer>
                </Paper>
              )}
            </>
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
