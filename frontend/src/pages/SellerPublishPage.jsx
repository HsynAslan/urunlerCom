import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  FormControlLabel,
  RadioGroup,
  List,
  ListItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import HelpWidget from '../components/HelpWidget';
import { useNavigate } from 'react-router-dom';

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

// Yeni: Skoru renkli yuvarlak olarak gösteren bileşen
function ScoreCircle({ score }) {
  let color = '#2196f3'; // mavi - orta
  if (score >= 75) color = '#4caf50'; // yeşil - yüksek
  else if (score < 50) color = '#f44336'; // kırmızı - düşük

  return (
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: `6px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color,
        userSelect: 'none',
        mb: 2,
      }}
      aria-label={`Score: ${score}`}
      title={`Score: ${score}`}
    >
      {score}
    </Box>
  );
}

const SellerPublishPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [about, setAbout] = useState('');
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState([]);

  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [schemas, setSchemas] = useState([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState(null);
  const [savingSchema, setSavingSchema] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState(null);

  const [slug, setSlug] = useState(null);

  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // İçerik değerlendirme popup durumu ve sonucu
  const [showContentReviewDialog, setShowContentReviewDialog] = useState(false);
  const [contentReviewResult, setContentReviewResult] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileSidebarOpen(false);
  };

  // 1. Satıcı bilgisi al
  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/store`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSlug(res.data.slug);
      } catch (err) {
        console.error('Satıcı bilgisi alınamadı:', err);
        setErrors([t('publishPage.errors.sellerInfo')]);
        toast.error(t('publishPage.errors.sellerInfo'));
        setLoading(false);
      }
    };
    fetchSellerInfo();
  }, [token, t]);

  // 2. Public satıcı verisi çek ve linki ayarla
  useEffect(() => {
    if (!slug) return;

    const url = `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'}/${slug}`;
    setPublishedUrl(url);

    const fetchPublicSellerData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/public/sellers/${slug}`
        );
        setCompany(res.data.company);
        setProducts(res.data.products);
        setAbout(res.data.about?.content || '');
        setPhotos(res.data.photos);
        setErrors([]);
      } catch (err) {
        console.error('Public satıcı verisi alınamadı:', err);
        setErrors([t('publishPage.errors.publicData')]);
        toast.error(t('publishPage.errors.publicData'));
      } finally {
        setLoading(false);
      }
    };
    fetchPublicSellerData();
  }, [slug, t]);

  // Güncellenen kontrol: ürün zorunluluğu kaldırıldı,
  // hakkında kısa olsa bile uyarı verir ama engellemez,
  // diğer zorunlu alanlar şirket adı ve telefon
  const checkDataCompleteness = () => {
    const errorList = [];

    if (!company?.companyName || !company.contactInfo?.phone)
      errorList.push(t('publishPage.errors.companyInfo'));
    // Ürün zorunlu değil, kaldırıldı
    // if (products.length === 0) errorList.push(t('publishPage.errors.products'));
    // Hakkında çok kısa ise uyarı ama engelleme yok, onu popup'ta göster
    // Fotoğraf zorunlu
    if (photos.length < 1) errorList.push(t('publishPage.errors.photos'));

    setErrors(errorList);
    return errorList.length === 0;
  };

  // İçerik değerlendirme çağrısı
  const runContentReview = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/content-review`,
        { company, products, about, photos },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContentReviewResult(res.data);
      setShowContentReviewDialog(true);
    } catch (err) {
      console.error('İçerik değerlendirme başarısız:', err);
      toast.error(t('publishPage.errors.contentReview'));
    } finally {
      setLoading(false);
    }
  };

  // handleContinue, zorunlu alanlar doğruysa içerik değerlendirme yapar
  const handleContinue = () => {
    if (checkDataCompleteness()) {
      runContentReview();
    } else {
      toast.warn(t('publishPage.warnings.completeData'));
    }
  };

  // Şemalar çekilir
  const fetchSchemas = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/themes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchemas(res.data);
      setShowSchemaModal(true);
    } catch (err) {
      console.error('Şemalar alınamadı:', err);
      toast.error(t('publishPage.errors.schemas'));
    } finally {
      setLoading(false);
    }
  };

  // Şema seçimi kaydet
  const handleSchemaSelect = async () => {
    if (!selectedSchemaId) {
      toast.info(t('publishPage.info.selectSchema'));
      return;
    }

    try {
      setSavingSchema(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/select-schema`,
        { schemaId: selectedSchemaId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const url = `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'}/${slug}`;
      setPublishedUrl(url);
      setShowSchemaModal(false);
      toast.success(t('publishPage.success.published'));

      // Tema seçildikten sonra mail gönder
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/send-published-link`,
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      
      toast.error(t('publishPage.errors.saveSchema'));
    } finally {
      setSavingSchema(false);
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

function ContentReviewDialog({ open, onClose, data, onEdit, onSchemaSelect }) {
  if (!data) return null;

  // Tüm önerileri tek listede toplayalım
  const allSuggestions = [];
  if (data.suggestions) {
    Object.entries(data.suggestions).forEach(([key, arr]) => {
      if (Array.isArray(arr) && arr.length > 0) {
        arr.forEach((msg) => allSuggestions.push({ field: key, message: msg }));
      }
    });
  }

  // Öneri var mı kontrolü
  const hasSuggestions = allSuggestions.length > 0;
  const showDefaultWarning = data.score < 80 && !hasSuggestions;
  // Alan isimlerini kullanıcıya gösterilecek hale çevirmek için:
  const fieldLabels = {
    about: t('publishPage.contentReview.fields.about', 'Hakkında'),
    companyInfo: t('publishPage.contentReview.fields.companyInfo', 'Şirket Bilgileri'),
    products: t('publishPage.contentReview.fields.products', 'Ürünler'),
    photos: t('publishPage.contentReview.fields.photos', 'Fotoğraflar'),
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{t('publishPage.contentReview.title')}</span>
        <ScoreCircle score={data.score} />
      </DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 2 }}>{t('publishPage.contentReview.description')}</Typography>

        {hasSuggestions ? (
  <List dense>
    {data.suggestions.map((sug, i) => (
      <ListItem key={i}>• {sug}</ListItem>
    ))}
  </List>
) : showDefaultWarning ? (
  <Typography color="warning.main" sx={{ mt: 2 }}>
    {t('publishPage.contentReview.defaultLowScoreWarning')}
  </Typography>
) : (
  <Typography>{t('publishPage.contentReview.noSuggestions')}</Typography>
)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onEdit}>{t('publishPage.contentReview.editButton')}</Button>
        <Button onClick={onSchemaSelect} variant="contained" color="primary">
          {t('publishPage.contentReview.proceedButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

  if (loading)
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            bgcolor: 'background.default',
            color: 'text.primary',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );

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
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { md: '80%' },
              position: 'relative',
            }}
          >
            {/* Dil Seçici */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1500 }}>
              <LanguageSelector />
            </Box>

            {/* Yayınlanmış Link (her zaman üstte) */}
            {publishedUrl && (
              <Box
                sx={{
                  position: 'sticky',
                  top: 0,
                  bgcolor: darkMode ? '#223344' : '#eef4f8',
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                  zIndex: 1200,
                  wordBreak: 'break-all',
                }}
              >
                <Typography>
                  {t('publishPage.publishedUrlLabel')}{' '}
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: darkMode ? '#90caf9' : '#3f51b5' }}
                  >
                    {publishedUrl}
                  </a>
                </Typography>
              </Box>
            )}

            {/* Başlık */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              📄 {t('publishPage.title')}
            </Typography>

            {/* Şirket Bilgileri */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🔹 {t('publishPage.companyInfo')}
              </Typography>
              {company ? (
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>
                    <strong>{t('publishPage.companyName')}:</strong> {company.companyName}
                  </li>
                  <li>
                    <strong>{t('publishPage.slug')}:</strong> {slug || '-'}
                  </li>
                  <li>
                    <strong>{t('publishPage.phone')}:</strong> {company.contactInfo?.phone}
                  </li>
                  <li>
                    <strong>{t('publishPage.email')}:</strong> {company.contactInfo?.email}
                  </li>
                  <li>
                    <strong>{t('publishPage.address')}:</strong> {company.contactInfo?.address}
                  </li>
                </Box>
              ) : (
                <Typography>{t('publishPage.noData')}</Typography>
              )}
            </Box>

            {/* Ürünler */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                📦 {t('publishPage.products')} ({products.length})
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {products.map((p) => (
                  <li key={p._id}>
                    {p.name} - {p.price} {p.priceCurrency}
                  </li>
                ))}
              </Box>
            </Box>

            {/* Hakkında */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🧾 {t('publishPage.about')}
              </Typography>
              <Typography>{about || t('publishPage.noAbout')}</Typography>
            </Box>

            {/* Fotoğraflar */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🖼️ {t('publishPage.photos')} ({photos.length})
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))',
                  gap: 1,
                }}
              >
                {photos.map((p) => (
                  <Box
                    component="img"
                    key={p._id}
                    src={p.imageUrl}
                    alt={p.caption || t('publishPage.photoAlt')}
                    sx={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 1 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Hatalar */}
            {errors.length > 0 && (
              <Box
                sx={{
                  bgcolor: 'error.main',
                  color: 'error.contrastText',
                  p: 2,
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <Typography variant="h6">{t('publishPage.errors.title')}</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </Box>
              </Box>
            )}

            {/* Devam Butonu */}
            <Button variant="contained" onClick={handleContinue} sx={{ minWidth: 150 }} endIcon={<span>➡️</span>}>
              {t('publishPage.continue')}
            </Button>

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

            {/* Şema seçim modalı */}
            <Dialog open={showSchemaModal} onClose={() => setShowSchemaModal(false)} maxWidth="sm" fullWidth>
              <DialogTitle>{t('publishPage.schemaModal.title')}</DialogTitle>
              <DialogContent dividers>
                {schemas.length === 0 ? (
                  <Typography>{t('publishPage.schemaModal.noSchemas')}</Typography>
                ) : (
                  <RadioGroup
                    value={selectedSchemaId}
                    onChange={(e) => setSelectedSchemaId(e.target.value)}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {schemas.map((schema) => (
                      <Box
                        key={schema._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          p: 1,
                        }}
                      >
                        <FormControlLabel value={schema._id} control={<Radio />} label={schema.name} sx={{ flexGrow: 1 }} />
                        {schema.previewImageUrl && (
                          <Box
                            component="img"
                            src={schema.previewImageUrl}
                            alt={`${schema.name} ${t('publishPage.schemaModal.previewAlt')}`}
                            sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1 }}
                          />
                        )}
                      </Box>
                    ))}
                  </RadioGroup>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowSchemaModal(false)} disabled={savingSchema}>
                  {t('publishPage.schemaModal.cancel')}
                </Button>
                <Button onClick={handleSchemaSelect} variant="contained" disabled={savingSchema}>
                  {savingSchema ? t('publishPage.schemaModal.saving') : t('publishPage.schemaModal.confirm')}
                </Button>
              </DialogActions>
            </Dialog>

            {/* İçerik Değerlendirme Dialogu */}
            <ContentReviewDialog
              open={showContentReviewDialog}
              data={contentReviewResult}
              onClose={() => setShowContentReviewDialog(false)}
              onEdit={() => {
                setShowContentReviewDialog(false);
                handleNavigation('/seller/about');
              }}
              onSchemaSelect={() => {
                setShowContentReviewDialog(false);
                fetchSchemas();
              }}
            />
          </Box>
        </Box>
      </ThemeProvider>
      <HelpWidget pageKey={'publishPage'} />
    </>
  );
};

export default SellerPublishPage;
