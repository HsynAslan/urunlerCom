import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Paper,
  Grid,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Fab,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import axios from 'axios';
import { toast } from 'react-toastify';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';


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

const SellerPremiumPage = () => {
  const [seller, setSeller] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const token = localStorage.getItem('token');

  // Fiyatlar environment değişkenlerinden gelir, yoksa default değerler
  const monthlyPrice = process.env.REACT_APP_PREMIUM_MONTHLY || '99';
  const yearlyPrice = process.env.REACT_APP_PREMIUM_YEARLY || '999';
  const lifetimePrice = process.env.REACT_APP_PREMIUM_LIFETIME || '2499';

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/store`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSeller(data);
      } catch (error) {
        toast.error('Satıcı bilgileri yüklenemedi.');
      }
    };
    fetchSeller();
  }, [token]);

  const handleInput = (e) => {
    setCardData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpgrade = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/upgrade-plan`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Premium plana geçiş başarılı!');
      setSeller((prev) => ({ ...prev, plan: 'premium' }));
    } catch (error) {
      toast.error('Yükseltme başarısız oldu.');
    }
  };

  const handleTestCard = () => {
    setCardData({
      number: '4111 1111 1111 1111',
      expiry: '12/30',
      cvv: '123',
      name: 'TEST USER',
    });
    setTimeout(handleUpgrade, 800);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (!seller) return <Typography>Yükleniyor...</Typography>;

  if (seller.plan === 'premium') {
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

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              🎉 Premium Dashboard
            </Typography>

            <Typography>
              📦 Ürünlerinizi buradan yönetebilir ve gelen siparişleri görebilirsiniz.
            </Typography>

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
              >
                {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </Button>
            </Box>
          </Box>
        </Box>
        
      </ThemeProvider>
    );
  }

  // Satıcı premium değilse ödeme ekranı
  return (
    <>
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

            <Typography variant="h4" gutterBottom>
              Premium Plan Avantajları
            </Typography>

            <Grid container spacing={2} mb={3}>
              {[
                {
                  title: 'Aylık',
                  desc: '1000+ ürün ekleyebilme kapasitesi.',
                  price: monthlyPrice,
                },
                {
                  title: 'Yıllık',
                  desc: '7/24 canlı müşteri desteği.',
                  price: yearlyPrice,
                },
                {
                  title: 'Sabit',
                  desc: 'Anasayfada daha fazla görünürlük.',
                  price: lifetimePrice,
                },
              ].map((plan, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Card sx={{ height: '100%', background: '#1976d2', color: '#fff' }}>
                    <CardContent>
                      <Typography variant="h6">{plan.title}</Typography>
                      <Typography variant="body2">{plan.desc}</Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {`${plan.price} ₺`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Paper elevation={4} sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                Ödeme Bilgileri
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Kart Üzerindeki İsim"
                  name="name"
                  value={cardData.name}
                  onChange={handleInput}
                />
                <TextField
                  label="Kart Numarası"
                  name="number"
                  value={cardData.number}
                  onChange={handleInput}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Son Kullanma"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleInput}
                  />
                  <TextField
                    label="CVV"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleInput}
                  />
                </Stack>
                <Button variant="contained" size="large" onClick={handleUpgrade}>
                  Hemen Satın Al
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleTestCard}>
                  💳 Test Kartı ile Geçiş Yap
                </Button>
              </Stack>
            </Paper>

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
              >
                {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </Button>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
      
    </>
  );
};

export default SellerPremiumPage;
