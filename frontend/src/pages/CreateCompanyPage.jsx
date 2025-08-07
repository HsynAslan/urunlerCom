import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  Backdrop,
  Fade,
  useMediaQuery,
  Paper,
  Stack,
  Fab,
  createTheme,
  ThemeProvider,
  useTheme,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  maxWidth: 480,
  width: '90%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CreateCompanyPage = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const token = localStorage.getItem('token');

  const neonShadowColor = darkMode ? '#00ffd8' : '#00897b';

  const [sellerInfo, setSellerInfo] = useState(null);
  const [form, setForm] = useState({
    companyName: '',
    slug: '',
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      website: '',
      location: '',
      instagram: '',
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [slugError, setSlugError] = useState(null);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/store`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSellerInfo(data);
        setForm({
          companyName: data.companyName || '',
          slug: data.slug || '',
          contactInfo: {
            phone: data.contactInfo?.phone || '',
            email: data.contactInfo?.email || '',
            address: data.contactInfo?.address || '',
            website: data.contactInfo?.website || '',
            location: data.contactInfo?.location || '',
            instagram: data.contactInfo?.instagram || '',
          },
        });
      } catch (err) {
        console.error('Seller fetch error:', err);
        toast.error('Şirket bilgileri alınırken hata oluştu ⚠️');
      }
    };
    fetchSeller();
  }, [token]);

  const normalizeSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '')
      .replace(/-+/g, '-');

  const checkSlug = useCallback(
    async (slugValue) => {
      if (!slugValue) {
        setSlugError(null);
        return;
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(slugValue)) {
        showSlugError('Slug sadece harf, rakam, - ve _ içerebilir ❗');
        return;
      }
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/check-slug`,
          { slug: slugValue },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.exists && res.data.exists !== sellerInfo?._id) {
          toast.error('Bu slug zaten kullanılıyor 🚫');
          setSlugError('Slug zaten kullanılıyor.');
        } else {
          setSlugError(null);
        }
      } catch (err) {
        console.error('Slug kontrol hatası:', err);
        toast.error('Slug kontrolü yapılamadı ⚠️');
        showSlugError('Slug kontrolü yapılamadı.');
      }
    },
    [token, sellerInfo]
  );

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === 'slug') {
      const cleanedSlug = normalizeSlug(value);
      setForm((prev) => ({ ...prev, slug: cleanedSlug }));

      if (value !== cleanedSlug) {
        setSlugError('Slug otomatik olarak düzeltildi 🛠️');
        toast.info('Slug geçersiz karakterler içeriyordu, düzeltildi ✏️');
      } else {
        setSlugError(null);
      }

      checkSlug(cleanedSlug);
      return;
    }

    if (name in form.contactInfo) {
      setForm((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const showSlugError = (msg) => {
    setSlugError(msg);
    setTimeout(() => {
      setSlugError(null);
    }, 4000);
  };

  const handleSave = async () => {
    if (slugError) {
      toast.error('Lütfen slug alanındaki hatayı düzeltin ❌');
      return;
    }

    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/update`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSellerInfo(data);
      setShowModal(false);
      toast.success('Bilgiler başarıyla kaydedildi ✅');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Kaydetme sırasında hata oluştu ❌');
    }
  };

  // Tema toggle fonksiyonu
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

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
          position: 'relative',
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
        )}

        {/* İçerik */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            position: 'relative',
            minHeight: '100vh',
            overflowY: 'auto',
            color: 'text.primary',
            textShadow: darkMode
              ? `0 0 8px ${neonShadowColor}, 0 0 20px ${neonShadowColor}`
              : 'none',
            width: { xs: '90%', md: '80%' },
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

          {/* Sayfa başlığı */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2, textShadow: 'none', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            🏢 {t('sellerCreateCompany.title', 'Şirket Oluştur veya Düzenle')}
          </Typography>

          {sellerInfo ? (
            <Paper
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                boxShadow: 3,
                color: 'text.primary',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" gutterBottom>
                <strong>📛 {t('sellerCreateCompany.companyName', 'Şirket Adı')}:</strong>{' '}
                {sellerInfo.companyName || '-'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>🔗 {t('sellerCreateCompany.slug', "Sayfa URL'si")}:</strong> {sellerInfo.slug || '-'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>📞 {t('sellerCreateCompany.phone', 'Telefon')}:</strong>{' '}
                {sellerInfo.contactInfo?.phone || '-'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>📧 {t('sellerCreateCompany.email', 'Email')}:</strong>{' '}
                {sellerInfo.contactInfo?.email || '-'}
              </Typography>

              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setShowModal(true)}>
                ✏️ {t('sellerCreateCompany.edit', 'Düzenle')}
              </Button>
            </Paper>
          ) : (
            <Typography>⏳ {t('sellerCreateCompany.loading', 'Yükleniyor...')}</Typography>
          )}

          {/* Modal */}
          <Modal
            aria-labelledby="edit-company-modal-title"
            aria-describedby="edit-company-modal-description"
            open={showModal}
            onClose={() => setShowModal(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 500 } }}
          >
            <Fade in={showModal}>
              <Box sx={modalStyle}>
                <Typography
                  id="edit-company-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  📝 {t('sellerCreateCompany.editCompany', 'Şirket Bilgilerini Düzenle')}
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label={t('sellerCreateCompany.companyName', 'Şirket Adı')}
                    name="companyName"
                    fullWidth
                    value={form.companyName}
                    onChange={handleInput}
                    variant="outlined"
                    color={darkMode ? 'secondary' : 'primary'}
                  />

                  <TextField
                    label={t('sellerCreateCompany.slug', "Slug (sayfa URL'si)")}
                    name="slug"
                    fullWidth
                    value={form.slug}
                    onChange={handleInput}
                    error={!!slugError}
                    helperText={slugError}
                    variant="outlined"
                    color={darkMode ? 'secondary' : 'primary'}
                  />

                  {['phone', 'email', 'address', 'website', 'location', 'instagram'].map((field) => (
                    <TextField
                      key={field}
                      label={t(`sellerCreateCompany.${field}`, field)}
                      name={field}
                      fullWidth
                      value={form.contactInfo[field]}
                      onChange={handleInput}
                      variant="outlined"
                      color={darkMode ? 'secondary' : 'primary'}
                    />
                  ))}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="error" onClick={() => setShowModal(false)}>
                      ❌ {t('sellerCreateCompany.cancel', 'İptal')}
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave} disabled={!!slugError}>
                      💾 {t('sellerCreateCompany.save', 'Kaydet')}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Fade>
          </Modal>
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
            onClick={toggleDarkMode}
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
    PaperProps={{
      sx: {
        width: '100%',         // Tam genişlik
        height: '100vh',       // Tam yükseklik
        maxHeight: '100vh',
        overflowY: 'auto',     // İçerik taşarsa scroll
      },
    }}
  />
)}

      </Box>
    </ThemeProvider>
  );
};

export default CreateCompanyPage;
