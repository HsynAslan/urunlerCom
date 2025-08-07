import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Fab,
  Paper,
  Grid,
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

const SellerPhotosPage = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPhotos(res.data))
      .catch((err) => {
        console.error(err);
        toast.error('❌ ' + t('photoList.fetchError', 'Fotoğraflar alınamadı.'));
      });
  }, [token, t]);

  const handleAdd = async () => {
    if (!imageUrl.trim()) {
      toast.error('❌ ' + t('photoList.imageUrlRequired', 'Görsel URL boş olamaz.'));
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/photos`,
        { imageUrl, caption },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPhotos([...photos, res.data]);
      setImageUrl('');
      setCaption('');
      toast.success('✅ ' + t('photoList.added', 'Fotoğraf eklendi.'));
    } catch (err) {
      console.error(err);
      toast.error('❌ ' + t('photoList.addError', 'Fotoğraf eklenemedi.'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos((prev) => prev.filter((photo) => photo._id !== id));
      toast.success('🗑️ ' + t('photoList.deleted', 'Fotoğraf silindi.'));
    } catch (err) {
      console.error(err);
      toast.error('❌ ' + t('photoList.deleteError', 'Fotoğraf silinemedi.'));
    }
  };

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
            width: {  md: '80%' },
            position: 'relative',
          }}
        >
          {/* Dil Seçici sağ üst köşede */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1500 }}>
            <LanguageSelector />
          </Box>

          {/* Sayfa Başlığı */}
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            📸 {t('photoList.title', 'Fotoğraflarım')}
          </Typography>

          {/* Fotoğraf Ekleme Formu */}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mb: 4,
              maxWidth: 600,
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <TextField
              label={t('photoList.imageUrl', 'Görsel URL')}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              fullWidth
              variant="outlined"
              color={darkMode ? 'primary' : 'secondary'}
            />
            <TextField
              label={t('photoList.caption', 'Açıklama')}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t('photoList.captionPlaceholder', 'Ürün vitrin resmi vs.')}
              fullWidth
              variant="outlined"
              color={darkMode ? 'primary' : 'secondary'}
            />
            <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'start' }}>
              ➕ {t('photoList.add', 'Ekle')}
            </Button>
          </Box>

          {/* Fotoğraf Galerisi */}
          <Grid container spacing={3}>
            {photos.map((photo) => (
              <Grid item xs={12} sm={6} md={4} key={photo._id}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  elevation={3}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || t('photoList.photoAlt', 'Fotoğraf')}
                    style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }}
                  />
                  <Typography variant="body2" mt={1} mb={1} textAlign="center" color="text.primary">
                    {photo.caption}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(photo._id)}
                  >
                    🗑️ {t('photoList.delete', 'Sil')}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Tema Değiştirici */}
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
};

export default SellerPhotosPage;
