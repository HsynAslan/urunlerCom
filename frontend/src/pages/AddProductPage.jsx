import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Fab,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import HelpWidget from '../components/HelpWidget'; 
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

const currencyOptions = [
  { value: 'TRY', label: 'TL' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

const stockUnitOptions = [
  { value: 'adet', label: 'Adet' },
  { value: 'ml', label: 'ml' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
];

const AddProductPage = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    priceCurrency: 'TRY',
    stock: '',
    stockUnit: 'adet',
    images: [],
    showcaseImageIndex: 0,
    descriptionSections: [{ title: '', items: [''] }],
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Açıklama bölümü değişiklikleri
  const handleDescriptionChange = (sectionIndex, field, value, itemIndex = null) => {
    setForm(prev => {
      const newSections = [...prev.descriptionSections];
      if (field === 'title') newSections[sectionIndex].title = value;
      else if (field === 'item' && itemIndex !== null) newSections[sectionIndex].items[itemIndex] = value;
      return { ...prev, descriptionSections: newSections };
    });
  };

  const addDescriptionSection = () =>
    setForm(prev => ({
      ...prev,
      descriptionSections: [...prev.descriptionSections, { title: '', items: [''] }],
    }));

  const addDescriptionItem = sectionIndex =>
    setForm(prev => {
      const newSections = [...prev.descriptionSections];
      newSections[sectionIndex].items.push('');
      return { ...prev, descriptionSections: newSections };
    });

  const addImage = () => {
    const url = prompt(t('productAdd.enterPhotoUrl', "Fotoğraf URL'si giriniz:"));
    if (url) setForm(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const setShowcaseImage = index => setForm(prev => ({ ...prev, showcaseImageIndex: index }));

  const generateSlug = name =>
    name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

  const onNameChange = e => {
    const name = e.target.value;
    setForm(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const postData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/products`,
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('✅ ' + t('productAdd.success'));
      setSuccess(t('productAdd.success'));
      setForm({
        name: '',
        slug: '',
        price: '',
        priceCurrency: 'TRY',
        stock: '',
        stockUnit: 'adet',
        images: [],
        showcaseImageIndex: 0,
        descriptionSections: [{ title: '', items: [''] }],
      });
    } catch (err) {
      const msg = err.response?.data?.message || t('productAdd.error');
      toast.error('❌ ' + msg);
      setError(msg);
    }
  };

  // Neon glow renk (dark modda parlak mavi, açık modda koyu yeşil)
  const neonShadowColor = darkMode ? '#40c4ff' : '#00897b';

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
              p: 3,
              minHeight: '100vh',
              overflowY: 'auto',
            }}
          >
            <SellerSidebar />
          </Box>
        )}

        {/* Mobil Menü Butonu */}
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
                zIndex: 2000,
                boxShadow: darkMode
                  ? `0 0 10px 3px ${neonShadowColor}`
                  : 'none',
              }}
            >
              <MenuIcon />
            </Fab>
            <SellerSidebar
              variant="temporary"
              mobileOpen={mobileSidebarOpen}
              setMobileOpen={setMobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
              PaperProps={{
                sx: {
                  width: '100%',
                  height: '100vh',
                  maxHeight: '100vh',
                  overflowY: 'auto',
                  p: 3,
                },
              }}
            />
          </>
        )}

        {/* İçerik Alanı */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 6,
            pb: 12,
            px: { xs: 2, sm: 3, md: 6 },
            width: { md: '80%' },
            ml: {  },
            position: 'relative',
            minHeight: '100vh',
            overflowY: 'auto',
            
          }}
        >
          {/* Dil Seçici sağ üst köşede */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1500 }}>
            <LanguageSelector />
          </Box>

          {/* Sayfa Başlığı */}
          <Typography variant="h4" style={{ display: 'flex', justifyContent: 'center' }} sx={{ fontWeight: 700, mb: 4 }}>
            🆕 {t('productAdd.title')}
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 700,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <TextField
              label={t('productAdd.name')}
              name="name"
              value={form.name}
              onChange={onNameChange}
              required
              fullWidth
              color={darkMode ? 'primary' : 'secondary'}
              sx={{ '& label.Mui-focused': { color: neonShadowColor } }}
            />
            <TextField
              label={t('productAdd.slug')}
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              fullWidth
              color={darkMode ? 'primary' : 'secondary'}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('productAdd.price')}
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                required
                fullWidth
                color={darkMode ? 'primary' : 'secondary'}
              />
              <TextField
                label={t('productAdd.priceCurrency')}
                name="priceCurrency"
                value={form.priceCurrency}
                onChange={handleChange}
                select
                fullWidth
                color={darkMode ? 'primary' : 'secondary'}
              >
                {currencyOptions.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('productAdd.stock')}
                name="stock"
                value={form.stock}
                onChange={handleChange}
                type="number"
                required
                fullWidth
                color={darkMode ? 'primary' : 'secondary'}
              />
              <TextField
                label={t('productAdd.stockUnit')}
                name="stockUnit"
                value={form.stockUnit}
                onChange={handleChange}
                select
                fullWidth
                color={darkMode ? 'primary' : 'secondary'}
              >
                {stockUnitOptions.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* Fotoğraflar */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mb: 1, fontWeight: 'bold', color: neonShadowColor }}
              >
                📸 {t('productAdd.photos')}
              </Typography>
              <Button
                variant="outlined"
                onClick={addImage}
                sx={{
                  mb: 2,
                  borderColor: neonShadowColor,
                  color: neonShadowColor,
                  '&:hover': {
                    borderColor: neonShadowColor,
                    backgroundColor: darkMode ? '#15314e' : '#d0f0e9',
                  },
                }}
              >
                ➕ {t('productAdd.addPhoto')}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                {form.images.length === 0 && (
                  <Typography color="text.secondary">
                    {t('productAdd.noPhoto')}
                  </Typography>
                )}
                {form.images.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      border:
                        form.showcaseImageIndex === idx
                          ? `3px solid ${neonShadowColor}`
                          : '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      width: 80,
                      height: 80,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover': {
                        boxShadow: `0 0 8px 3px ${neonShadowColor}`,
                      },
                    }}
                    onClick={() => setShowcaseImage(idx)}
                    title={
                      form.showcaseImageIndex === idx
                        ? t('productAdd.showcasePhoto')
                        : t('productAdd.makeShowcase')
                    }
                  >
                    <img
                      src={img}
                      alt={`${t('productAdd.photoAlt')} ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Açıklama Bölümleri */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mt: 4, mb: 1, fontWeight: 'bold', color: neonShadowColor }}
              >
                📑 {t('productAdd.descriptionSections')}
              </Typography>

              {form.descriptionSections.map((section, sIdx) => (
                <Box
                  key={sIdx}
                  sx={{
                    mb: 3,
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 2,
                  }}
                >
                  <TextField
                    label={t('productAdd.sectionTitle')}
                    value={section.title}
                    onChange={(e) =>
                      handleDescriptionChange(sIdx, 'title', e.target.value)
                    }
                    fullWidth
                    required
                    color={darkMode ? 'primary' : 'secondary'}
                    sx={{ mb: 1 }}
                  />
                  {section.items.map((item, iIdx) => (
                    <TextField
                      key={iIdx}
                      label={t('productAdd.sectionItem')}
                      value={item}
                      onChange={(e) =>
                        handleDescriptionChange(sIdx, 'item', e.target.value, iIdx)
                      }
                      fullWidth
                      required
                      color={darkMode ? 'primary' : 'secondary'}
                      sx={{ mb: 1 }}
                    />
                  ))}
                  <Button
                    variant="text"
                    onClick={() => addDescriptionItem(sIdx)}
                    size="small"
                    sx={{ textTransform: 'none', color: neonShadowColor }}
                  >
                    ➕ {t('productAdd.addItem')}
                  </Button>
                </Box>
              ))}

              <Button
                variant="text"
                onClick={addDescriptionSection}
                size="small"
                sx={{ textTransform: 'none', color: neonShadowColor }}
              >
                ➕ {t('productAdd.addSection')}
              </Button>
            </Box>

            {/* Gönder Butonu */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                bgcolor: neonShadowColor,
                boxShadow: `0 0 12px ${neonShadowColor}`,
                '&:hover': {
                  bgcolor: darkMode ? '#29b6f6' : '#00796b',
                  boxShadow: `0 0 20px ${neonShadowColor}`,
                },
              }}
            >
              🆕 {t('productAdd.add')}
            </Button>
          </Box>

          {/* Başarı / Hata Mesajları */}
          {success && (
            <Typography
              color="success.main"
              sx={{ mt: 3, textAlign: 'center', fontWeight: 'bold' }}
            >
              ✅ {success}
            </Typography>
          )}
          {error && (
            <Typography
              color="error.main"
              sx={{ mt: 3, textAlign: 'center', fontWeight: 'bold' }}
            >
              ❌ {error}
            </Typography>
          )}
        </Box>

        {/* Tema Değiştirici */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            left: 32,
            zIndex: 1600,
          }}
        >
          <Tooltip
            title={
              darkMode
                ? t('switchToLight', 'Açık moda geç')
                : t('switchToDark', 'Koyu moda geç')
            }
          >
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="contained"
              size="small"
              sx={{
                minWidth: 40,
                minHeight: 40,
                borderRadius: '50%',
                bgcolor: darkMode ? '#1c2b3a' : '#e0e0e0',
                color: darkMode ? '#40c4ff' : '#000',
                boxShadow: darkMode ? `0 0 12px ${neonShadowColor}` : 'none',
                p: 0,
                '&:hover': {
                  bgcolor: darkMode ? '#2a3e54' : '#b0bec5',
                },
              }}
              aria-label="toggle theme"
            >
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </ThemeProvider>
     <HelpWidget pageKey="productAdd" />
</>
  );
};

export default AddProductPage;
