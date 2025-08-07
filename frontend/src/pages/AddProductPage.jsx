import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  Fab,
  createTheme,
  ThemeProvider,
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

  // Çoklu açıklama başlığı ve maddeleri için update fonksiyonu
  const handleDescriptionChange = (sectionIndex, field, value, itemIndex = null) => {
    setForm(prev => {
      const newSections = [...prev.descriptionSections];
      if (field === 'title') {
        newSections[sectionIndex].title = value;
      } else if (field === 'item' && itemIndex !== null) {
        newSections[sectionIndex].items[itemIndex] = value;
      }
      return { ...prev, descriptionSections: newSections };
    });
  };

  const addDescriptionSection = () => {
    setForm(prev => ({
      ...prev,
      descriptionSections: [...prev.descriptionSections, { title: '', items: [''] }],
    }));
  };

  const addDescriptionItem = (sectionIndex) => {
    setForm(prev => {
      const newSections = [...prev.descriptionSections];
      newSections[sectionIndex].items.push('');
      return { ...prev, descriptionSections: newSections };
    });
  };

  const addImage = () => {
    const url = prompt(t('productAdd.enterPhotoUrl', "Fotoğraf URL'si giriniz:"));
    if (url) {
      setForm(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const setShowcaseImage = (index) => {
    setForm(prev => ({ ...prev, showcaseImageIndex: index }));
  };

  const generateSlug = (name) => {
    return name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
  };

  const onNameChange = (e) => {
    const name = e.target.value;
    setForm(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

      await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/products`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
              p: 3,
              minHeight: '100vh',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 1300,
            }}
          >
            <SellerSidebar />
          </Box>
        )}

        {/* Mobilde aç/kapa butonu ortada altta */}
        {isMobile && (
          <Tooltip title={t('openMenu', 'Menüyü aç')}>
            <Fab
              color="primary"
              aria-label="menu"
              onClick={() => setMobileSidebarOpen(prev => !prev)}
              sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: theme.zIndex.drawer + 1,
                boxShadow: darkMode ? `0 0 10px 3px ${neonShadowColor}` : 'none',
              }}
            >
              <MenuIcon />
            </Fab>
          </Tooltip>
        )}

        {/* Mobil drawer olarak sidebar */}
        <SellerSidebar
          variant="temporary"
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          anchor="bottom"
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

        {/* İçerik alanı */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 3,
            pb: 6,
            px: {  },
            width: { xs: '100%', md: '80%' },
            ml: { md: '20%' },
            position: 'relative',
            minHeight: '100vh',
            overflowY: 'auto',
            textShadow: darkMode
              ? `0 0 8px ${neonShadowColor}, 0 0 20px ${neonShadowColor}`
              : 'none',
          }}
        >
          {/* Dil seçici sağ üstte */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1500 }}>
            <LanguageSelector />
          </Box>

          {/* Başlık */}
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            🆕 {t('productAdd.title')}
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 600,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label={t('productAdd.name')}
              name="name"
              value={form.name}
              onChange={onNameChange}
              required
              fullWidth
            />
            <TextField
              label={t('productAdd.slug')}
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label={t('productAdd.price')}
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                required
                fullWidth
              />
              <TextField
                label={t('productAdd.priceCurrency')}
                name="priceCurrency"
                value={form.priceCurrency}
                onChange={handleChange}
                select
                fullWidth
              >
                {currencyOptions.map(c => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label={t('productAdd.stock')}
                name="stock"
                value={form.stock}
                onChange={handleChange}
                type="number"
                required
                fullWidth
              />
              <TextField
                label={t('productAdd.stockUnit')}
                name="stockUnit"
                value={form.stockUnit}
                onChange={handleChange}
                select
                fullWidth
              >
                {stockUnitOptions.map(s => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* Fotoğraflar */}
            <Box>
              <Typography variant="h6" gutterBottom>
                📸 {t('productAdd.photos')}
              </Typography>
              <Button variant="outlined" onClick={addImage} sx={{ mb: 2 }}>
                ➕ {t('productAdd.addPhoto')}
              </Button>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {form.images.length === 0 && <Typography>{t('productAdd.noPhoto')}</Typography>}
                {form.images.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      border:
                        form.showcaseImageIndex === idx
                          ? `3px solid ${darkMode ? '#00ffd8' : '#00897b'}`
                          : '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      width: 80,
                      height: 80,
                      overflow: 'hidden',
                      position: 'relative',
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

            {/* Açıklama bölümleri */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                📑 {t('productAdd.descriptionSections')}
              </Typography>

              {form.descriptionSections.map((section, sIdx) => (
                <Box key={sIdx} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                  <TextField
                    label={t('productAdd.sectionTitle')}
                    value={section.title}
                    onChange={e => handleDescriptionChange(sIdx, 'title', e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 1 }}
                  />
                  {section.items.map((item, iIdx) => (
                    <TextField
                      key={iIdx}
                      label={t('productAdd.sectionItem')}
                      value={item}
                      onChange={e => handleDescriptionChange(sIdx, 'item', e.target.value, iIdx)}
                      fullWidth
                      required
                      sx={{ mb: 1 }}
                    />
                  ))}
                  <Button
                    variant="text"
                    onClick={() => addDescriptionItem(sIdx)}
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    ➕ {t('productAdd.addItem')}
                  </Button>
                </Box>
              ))}

              <Button
                variant="text"
                onClick={addDescriptionSection}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                ➕ {t('productAdd.addSection')}
              </Button>
            </Box>

            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              🆕 {t('productAdd.add')}
            </Button>
          </Box>

          {success && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              ✅ {success}
            </Typography>
          )}
          {error && (
            <Typography color="error.main" sx={{ mt: 2 }}>
              ❌ {error}
            </Typography>
          )}
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
        <Tooltip title={darkMode ? t('switchToLight', 'Açık moda geç') : t('switchToDark', 'Koyu moda geç')}>
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
        </Tooltip>
      </Box>
    </ThemeProvider>
  );
};

export default AddProductPage;
