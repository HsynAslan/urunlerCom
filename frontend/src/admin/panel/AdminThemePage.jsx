import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Fab,
  Typography,
  TextField,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f9fafb', paper: '#fff' },
    text: { primary: '#374151', secondary: '#6b7280' },
  },
});

const AdminThemePage = () => {
  const [themes, setThemes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    cssFileUrl: '',
    previewImageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const theme = lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchThemes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/themes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setThemes(res.data);
    } catch (err) {
      console.error('Temalar alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/themes`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm({ name: '', cssFileUrl: '', previewImageUrl: '' });
      await fetchThemes();
    } catch (err) {
      if (err.response) {
        console.error('Sunucu hatası:', err.response.data);
      } else if (err.request) {
        console.error('İstek yapıldı ama yanıt alınamadı:', err.request);
      } else {
        console.error('İstek hatası:', err.message);
      }
      setError('Tema eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu temayı silmek istediğinize emin misiniz?')) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/themes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchThemes();
    } catch (err) {
      if (err.response) {
        alert(`Tema silinemedi: ${err.response.data.message || 'Bilinmeyen hata'}`);
      } else if (err.request) {
        alert('Tema silinemedi: Sunucudan yanıt alınamadı.');
      } else {
        alert(`Tema silinemedi: ${err.message}`);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Masaüstü Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: '20%',
              bgcolor: 'background.paper',
              borderRight: `1px solid ${theme.palette.divider}`,
              minHeight: '100vh',
              position: 'relative',
              zIndex: 1300,
              p: 2,
            }}
          >
            <AdminSidebar />
          </Box>
        )}

        {/* Mobil hamburger ve sidebar */}
        {isMobile && (
          <>
            <Fab
              color="primary"
              aria-label="menu"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: theme.zIndex.drawer + 1,
              }}
            >
              <MenuIcon />
            </Fab>

            <AdminSidebar
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
            overflowY: 'auto',
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Tema Ayarları
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mb: 4, maxWidth: 600 }}
          >
            <TextField
              label="Tema Adı"
              fullWidth
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="CSS Dosya URL"
              fullWidth
              required
              value={form.cssFileUrl}
              onChange={(e) => setForm({ ...form, cssFileUrl: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Önizleme Görseli URL (Opsiyonel)"
              fullWidth
              value={form.previewImageUrl}
              onChange={(e) => setForm({ ...form, previewImageUrl: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ bgcolor: '#2563eb' }}
            >
              {loading ? 'Ekleniyor...' : 'Tema Ekle'}
            </Button>
            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
          </Box>

          <Typography variant="h5" fontWeight="600" mb={2}>
            Mevcut Temalar
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 2,
            }}
          >
            {themes.map((themeItem) => (
              <Paper
                key={themeItem._id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  position: 'relative',
                  backgroundColor: 'background.paper',
                  boxShadow: 1,
                }}
              >
                {themeItem.previewImageUrl ? (
                  <Box
                    component="img"
                    src={themeItem.previewImageUrl}
                    alt={themeItem.name}
                    sx={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 120,
                      backgroundColor: '#f3f4f6',
                      mb: 1,
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#9ca3af',
                      fontStyle: 'italic',
                    }}
                  >
                    Önizleme yok
                  </Box>
                )}
                <Typography variant="subtitle1" fontWeight="600">
                  {themeItem.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ wordBreak: 'break-all', mb: 1 }}
                >
                  {themeItem.cssFileUrl}
                </Typography>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(themeItem._id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                  }}
                >
                  Sil
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminThemePage;
