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
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  maxWidth: 480,
  width: '90%',
  maxHeight: '65%', 
  overflowY: 'auto', 
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
        toast.error('❌ Şirket bilgileri alınırken hata oluştu');
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSellerInfo(data);
      setShowModal(false);
      toast.success('✅ Bilgiler başarıyla kaydedildi');
    } catch (err) {
      toast.error('❌ Kaydetme sırasında hata oluştu');
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
        }}
      >
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

        <Box sx={{ flexGrow: 1, p: 3, width: { md: '80%' } }}>
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1500 }}>
            <LanguageSelector />
          </Box>

          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            🏢 {t('sellerCreateCompany.title', 'Şirket Oluştur veya Düzenle')}
          </Typography>

          {sellerInfo ? (
            <Paper
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                boxShadow: 4,
                borderRadius: 2,
              }}
            >
              <Typography gutterBottom>
                <strong>📛 {t('sellerCreateCompany.companyName', 'Şirket Adı')}:</strong> {sellerInfo.companyName || '-'}
              </Typography>
              <Typography gutterBottom>
                <strong>🔗 {t('sellerCreateCompany.slug', "Sayfa URL'si")}:</strong> {sellerInfo.slug || '-'}
              </Typography>
              <Typography gutterBottom>
                <strong>📞 {t('sellerCreateCompany.phone', 'Telefon')}:</strong> {sellerInfo.contactInfo?.phone || '-'}
              </Typography>
              <Typography gutterBottom>
                <strong>📧 {t('sellerCreateCompany.email', 'Email')}:</strong> {sellerInfo.contactInfo?.email || '-'}
              </Typography>

              <Button variant="contained" sx={{ mt: 2 }} onClick={() => setShowModal(true)}>
                ✏️ {t('sellerCreateCompany.edit', 'Düzenle')}
              </Button>
            </Paper>
          ) : (
            <Typography>⏳ {t('sellerCreateCompany.loading', 'Yükleniyor...')}</Typography>
          )}

          <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 500 } }}
          >
            <Fade in={showModal}>
              <Box sx={modalStyle}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📝 {t('sellerCreateCompany.editCompany', 'Şirket Bilgilerini Düzenle')}
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label={t('sellerCreateCompany.companyName', 'Şirket Adı')}
                    name="companyName"
                    fullWidth
                    value={form.companyName}
                    onChange={handleInput}
                  />
                  <TextField
                    label={t('sellerCreateCompany.slug', "Slug (sayfa URL'si)")}
                    name="slug"
                    fullWidth
                    value={form.slug}
                    onChange={handleInput}
                    error={!!slugError}
                    helperText={slugError}
                  />
                  {['phone', 'email', 'address', 'website', 'location', 'instagram'].map((field) => (
                    <TextField
                      key={field}
                      label={t(`sellerCreateCompany.${field}`, field)}
                      name={field}
                      fullWidth
                      value={form.contactInfo[field]}
                      onChange={handleInput}
                    />
                  ))}

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" color="error" onClick={() => setShowModal(false)}>
                      ❌ {t('sellerCreateCompany.cancel', 'İptal')}
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={!!slugError}>
                      💾 {t('sellerCreateCompany.save', 'Kaydet')}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Fade>
          </Modal>
        </Box>

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
    </ThemeProvider>
  );
};

export default CreateCompanyPage;
