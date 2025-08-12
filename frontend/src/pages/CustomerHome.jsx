// CustomerHome.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Badge,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
const drawerWidth = 300;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0b1220', paper: '#0f1724' },
    text: { primary: '#e6f0ff', secondary: '#9fb4c8' },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f4f7fb', paper: '#fff' },
    text: { primary: '#123248', secondary: '#546e7a' },
  },
});

const CustomerHome = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Data
  const [products, setProducts] = useState([]); // all premium products fetched
  const [featured, setFeatured] = useState([]); // subset shown on main page
  const [favorites, setFavorites] = useState([]); // array of productIds (from backend)
  const [cart, setCart] = useState([]); // { product, quantity }
  const [orders, setOrders] = useState([]);
  const [questions, setQuestions] = useState([]); // messages/questions, with answers
  const [profile, setProfile] = useState({ name: '', email: '', address: null });

  // UI state
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'info', message: '' });

  // search & pagination limited
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  // modals
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [openOrderFlow, setOpenOrderFlow] = useState(false); // multi-step order
  const [orderStep, setOrderStep] = useState(0);
  const [orderCustomerInfo, setOrderCustomerInfo] = useState({ name: '', email: '', address: '' });
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questionProductId, setQuestionProductId] = useState(null);
  const [openOrdersDialog, setOpenOrdersDialog] = useState(false);
  const [openMessagesDialog, setOpenMessagesDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  // backend API
  const getToken = () => localStorage.getItem('token');
  const api = axios.create({
    baseURL: (process.env.REACT_APP_API_BASE || 'https://urunlercom.onrender.com') + '/api/orders',
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  // --- Helpers: cart persistence in localStorage ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem('uc_cart_v1');
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('uc_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // profile.address persistence (frontend) - stored in localStorage under uc_profile
  useEffect(() => {
    try {
      const raw = localStorage.getItem('uc_profile_v1');
      if (raw) {
        const p = JSON.parse(raw);
        setProfile((prev) => ({ ...prev, ...p }));
        setOrderCustomerInfo((o) => ({ ...o, ...p }));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      const { name, email, address } = profile;
      localStorage.setItem('uc_profile_v1', JSON.stringify({ name, email, address }));
    } catch (e) {}
  }, [profile]);

  // --- Fetching data from backend ---
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get('/products/premium');
      setProducts(Array.isArray(res.data) ? res.data : []);
      // pick featured subset (shuffle & pick first 8)
      const items = Array.isArray(res.data) ? [...res.data] : [];
      shuffleArray(items);
      setFeatured(items.slice(0, 8));
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, severity: 'error', message: 'Ürünler yüklenemedi' });
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites'); // expects GET /favorites => [{ product: { .. } } or [productId] depending backend
      // normalize: if array of product objects -> extract ids
      if (Array.isArray(res.data)) {
        const ids = res.data.map((x) => (x.product ? x.product._id || x.product : x._id || x.product));
        setFavorites(ids);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      // no favorites endpoint? ignore silently, favorites will be empty
      setFavorites([]);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/my');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: 'Siparişler yüklenemedi' });
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await api.get('/questions'); // expects backend GET /questions -> user's questions
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data) {
        const { name, email } = res.data;
        setProfile((p) => ({ ...p, name: name || p.name, email: email || p.email }));
        setOrderCustomerInfo((o) => ({ ...o, name: name || o.name, email: email || o.email }));
      }
    } catch (err) {
      // ignore
    }
  };

  // initial load
  useEffect(() => {
    fetchProducts();
    fetchFavorites();
    fetchOrders();
    fetchQuestions();
    fetchProfile();
  }, []);

  // --- Utilities ---
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // --- Search with debounce ---
  const doSearch = (q) => {
    const normalized = (q || '').trim().toLowerCase();
    if (!normalized) {
      setSearchResults([]);
      return;
    }
    const results = products.filter((p) => {
      return (
        (p.name && p.name.toLowerCase().includes(normalized)) ||
        (p.translations &&
          Array.from(p.translations.values()).some((tr) =>
            ((tr.name || '') + (tr.description || '')).toLowerCase().includes(normalized)
          )) ||
        (p.description && p.description.toLowerCase().includes(normalized))
      );
    });
    setSearchResults(results);
  };

  // debounce for input
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useMemo(() => debounce(doSearch, 350), [products]);

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search, debouncedSearch]);

  // --- Favorite actions ---
  const handleAddFavorite = async (productId) => {
    if (favorites.includes(productId)) {
      setSnackbar({ open: true, severity: 'info', message: 'Zaten favoridesin' });
      return;
    }
    try {
      await api.post('/favorites', { productId });
      setFavorites((prev) => [...prev, productId]);
      setSnackbar({ open: true, severity: 'success', message: 'Favorilere eklendi' });
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: 'Favori eklenemedi' });
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await api.delete(`/favorites/${productId}`);
      setFavorites((prev) => prev.filter((id) => id !== productId));
      setSnackbar({ open: true, severity: 'success', message: 'Favoriden çıkarıldı' });
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: 'Favori çıkarılamadı' });
    }
  };

  // --- Cart actions ---
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.product._id === product._id);
      if (existing) {
        return prev.map((p) =>
          p.product._id === product._id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setSnackbar({ open: true, severity: 'success', message: 'Sepete eklendi' });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((it) => it.product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Order flow (multi-step) ---
  const openOrderModal = () => {
    // require cart not empty
    if (!cart || cart.length === 0) {
      setSnackbar({ open: true, severity: 'warning', message: 'Önce sepete ürün ekleyin' });
      return;
    }
    // load profile into order info
    setOrderCustomerInfo((o) => ({ ...o, name: profile.name || '', email: profile.email || '', address: profile.address || '' }));
    setOrderStep(0);
    setOpenOrderFlow(true);
  };

  const closeOrderModal = () => {
    setOpenOrderFlow(false);
    setOrderStep(0);
  };

  // Step handlers: 0 = review cart, 1 = address, 2 = payment, 3 = confirm
  const nextOrderStep = () => setOrderStep((s) => Math.min(3, s + 1));
  const prevOrderStep = () => setOrderStep((s) => Math.max(0, s - 1));

  const handleOrderCustomerChange = (field, value) => {
    setOrderCustomerInfo((o) => ({ ...o, [field]: value }));
  };

  const submitOrders = async () => {
    // Validate address
    if (!orderCustomerInfo.address || orderCustomerInfo.address.trim().length < 5) {
      setSnackbar({ open: true, severity: 'warning', message: 'Lütfen geçerli adres girin' });
      return;
    }

    try {
      // Optionally save profile.address locally (or call backend if schema supports)
      setProfile((p) => ({ ...p, address: orderCustomerInfo.address, name: orderCustomerInfo.name, email: orderCustomerInfo.email }));
      localStorage.setItem('uc_profile_v1', JSON.stringify({ name: orderCustomerInfo.name, email: orderCustomerInfo.email, address: orderCustomerInfo.address }));

      // For each cart item, create an order (server expects single product per order)
      for (const item of cart) {
        const payload = {
          productId: item.product._id,
          customerName: orderCustomerInfo.name || 'Anonim',
          customerEmail: orderCustomerInfo.email || '',
          quantity: item.quantity,
          // optionally include address if backend supports it
          // address: orderCustomerInfo.address
        };
        await api.post('/', payload);
      }

      setSnackbar({ open: true, severity: 'success', message: 'Siparişler oluşturuldu' });
      clearCart();
      fetchOrders();
      closeOrderModal();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, severity: 'error', message: 'Sipariş oluşturulurken hata oluştu' });
    }
  };

  // --- Questions (messages) ---
  const openQuestionForProduct = (productId) => {
    setQuestionProductId(productId);
    setQuestionText('');
    setOpenQuestionDialog(true);
  };

  const sendQuestion = async () => {
    if (!questionText.trim()) {
      setSnackbar({ open: true, severity: 'warning', message: 'Soru boş olamaz' });
      return;
    }
    try {
      const product = products.find((p) => p._id === questionProductId);
      if (!product) throw new Error('Ürün bulunamadı');
      await api.post('/questions', {
        sellerId: product.seller._id,
        productId: questionProductId,
        questionText,
      });
      setSnackbar({ open: true, severity: 'success', message: 'Soru gönderildi' });
      setOpenQuestionDialog(false);
      fetchQuestions();
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: 'Soru gönderilemedi' });
    }
  };

  // --- UI: Sidebar content ---
  const drawerContent = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ mr: 1 }}>{(profile.name || 'U')[0]}</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="700">{profile.name || 'Kullanıcı'}</Typography>
          <Typography variant="caption">{profile.email || 'email yok'}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List>
        <ListItem button onClick={() => { setFeatured((f) => f); setMobileOpen(false); }}>
          <ListItemIcon><CheckCircleOutlineIcon /></ListItemIcon>
          <ListItemText primary="Anasayfa (Featured)" />
        </ListItem>

        <ListItem button onClick={() => { setShowSearchDialog(true); setMobileOpen(false); }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Ürün Ara" />
        </ListItem>

        <ListItem button onClick={() => { setOpenCartDialog(true); setMobileOpen(false); }}>
          <ListItemIcon>
            <Badge badgeContent={cart.reduce((s, i) => s + i.quantity, 0)} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary={`Sepet (${cart.length})`} />
        </ListItem>

        <ListItem button onClick={() => { setOpenOrdersDialog(true); setMobileOpen(false); }}>
          <ListItemIcon><ShoppingBagIcon /></ListItemIcon>
          <ListItemText primary="Siparişlerim" />
        </ListItem>

        <ListItem button onClick={() => { setOpenMessagesDialog(true); setMobileOpen(false); }}>
          <ListItemIcon><QuestionAnswerIcon /></ListItemIcon>
          <ListItemText primary="Mesajlar / Sorular" />
        </ListItem>

        <ListItem button onClick={() => { setOpenProfileDialog(true); setMobileOpen(false); }}>
        <ListItemIcon><AccountCircleIcon /></ListItemIcon>
          <ListItemText primary="Profil" />
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ my: 1 }} />
      <Stack direction="row" spacing={1} justifyContent="space-between">
       
   
      </Stack>
    </Box>
  );

  // --- Render main UI ---
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>📦Müşteri Paneli</Typography>
{/* 
            <TextField
              size="small"
              placeholder="Ürün ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                sx: { bgcolor: 'background.paper', borderRadius: 1, mr: 2, width: { xs: 120, md: 280 } },
              }}
              onFocus={() => setShowSearchDialog(true)}
            /> */}

            <IconButton color="inherit" onClick={() => { setOpenCartDialog(true); }}>
              <Badge badgeContent={cart.reduce((s, i) => s + i.quantity, 0)} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton color="inherit" onClick={() => { setOpenMessagesDialog(true); }}>
              <QuestionAnswerIcon />
            </IconButton>

            <IconButton color="inherit" onClick={() => { setOpenProfileDialog(true); }}>
              <Avatar>{(profile.name || 'U')[0]}</Avatar>
            </IconButton>

            <IconButton color="inherit" onClick={() => setDarkMode((d) => !d)} sx={{ ml: 1 }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          {isMobile ? (
            <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer variant="permanent" open sx={{ '& .MuiDrawer-paper': { width: drawerWidth, top: '64px' } }}>
              {drawerContent}
            </Drawer>
          )}
        </Box>

        {/* Main area */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '80px', width: { md: `calc(100% - ${drawerWidth}px)` } }}>
          <Typography variant="h5" gutterBottom>Öne Çıkan Ürünler</Typography>

          {loadingProducts ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {featured.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar variant="rounded" src={(product.images && product.images[0]) || ''} sx={{ width: 64, height: 64 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700}>{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>{product.translations ? product.translations.get('tr')?.descriptionSections?.[0]?.title || '' : ''}</Typography>
                      </Box>
                    </Box>
                    <CardContent sx={{ pt: 0, flexGrow: 1 }}>
                      <Typography variant="h6" color="primary">{product.price} {product.priceCurrency}</Typography>
                      <Typography variant="caption" color="text.secondary">Stok: {product.stock} {product.stockUnit}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<FavoriteIcon />} onClick={() => favorites.includes(product._id) ? handleRemoveFavorite(product._id) : handleAddFavorite(product._id)}>
                        {favorites.includes(product._id) ? 'Favoride' : 'Favorilere Ekle'}
                      </Button>
                      <Button size="small" variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => addToCart(product)}>
                        Sepete Ekle
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<QuestionAnswerIcon />} onClick={() => openQuestionForProduct(product._id)}>
                        Soru Sor
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>Popüler Ürün Arama Sonuçları</Typography>
          {search && searchResults.length === 0 && <Typography>Arama bulunamadı</Typography>}
          <Grid container spacing={2}>
            {searchResults.slice(0, 24).map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>{product.translations ? product.translations.get('tr')?.descriptionSections?.[0]?.title || '' : ''}</Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>{product.price} {product.priceCurrency}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => favorites.includes(product._id) ? handleRemoveFavorite(product._id) : handleAddFavorite(product._id)}>
                      {favorites.includes(product._id) ? 'Favoride' : 'Favorilere Ekle'}
                    </Button>
                    <Button size="small" variant="contained" onClick={() => addToCart(product)}>Sepete Ekle</Button>
                    <Button size="small" onClick={() => openQuestionForProduct(product._id)}>Soru Sor</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* --- Dialogs / Modals --- */}

        {/* Cart dialog */}
        <Dialog open={openCartDialog} onClose={() => setOpenCartDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Sepetiniz</DialogTitle>
          <DialogContent>
            {cart.length === 0 ? (
              <Typography>Sepetiniz boş</Typography>
            ) : (
              <List>
                {cart.map((item) => (
                  <ListItem key={item.product._id} secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Button size="small" onClick={() => setCart(prev => prev.map(p => p.product._id === item.product._id ? {...p, quantity: Math.max(1, p.quantity - 1)} : p))}>-</Button>
                      <Typography sx={{ display: 'inline-block', minWidth: 28, textAlign: 'center' }}>{item.quantity}</Typography>
                      <Button size="small" onClick={() => setCart(prev => prev.map(p => p.product._id === item.product._id ? {...p, quantity: p.quantity + 1} : p))}>+</Button>
                      <Button color="error" size="small" onClick={() => removeFromCart(item.product._id)}>Kaldır</Button>
                    </Stack>
                  }>
                    <ListItemText primary={item.product.name} secondary={`${item.product.price} ${item.product.priceCurrency}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenCartDialog(false); setOpenOrderFlow(false); }}>Kapat</Button>
            <Button variant="contained" onClick={() => { setOpenCartDialog(false); openOrderModal(); }} disabled={cart.length === 0}>Sipariş Oluştur</Button>
          </DialogActions>
        </Dialog>

        {/* Order flow modal (multi-step) */}
        <Dialog open={openOrderFlow} onClose={closeOrderModal} fullWidth maxWidth="sm">
          <DialogTitle>Sipariş Oluştur</DialogTitle>
          <DialogContent dividers>
            {orderStep === 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>1) Sepet Özeti</Typography>
                {cart.map((item) => (
                  <Box key={item.product._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography>{item.product.name} x {item.quantity}</Typography>
                    <Typography>{item.product.price * item.quantity} {item.product.priceCurrency}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2">Toplam: {cart.reduce((s, i) => s + i.product.price * i.quantity, 0)} TL</Typography>
              </>
            )}

            {orderStep === 1 && (
              <>
                <Typography variant="subtitle1" gutterBottom>2) Adres Bilgileri</Typography>
                <TextField fullWidth label="Ad Soyad" sx={{ mt: 1 }} value={orderCustomerInfo.name} onChange={(e) => handleOrderCustomerChange('name', e.target.value)} />
                <TextField fullWidth label="E-mail" sx={{ mt: 1 }} value={orderCustomerInfo.email} onChange={(e) => handleOrderCustomerChange('email', e.target.value)} />
                <TextField fullWidth label="Adres (teslimat)" sx={{ mt: 1 }} multiline minRows={3} value={orderCustomerInfo.address} onChange={(e) => handleOrderCustomerChange('address', e.target.value)} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Adres bilgisi yerel olarak saklanır; istersen profilinde güncelleyebilirsin.</Typography>
              </>
            )}

            {orderStep === 2 && (
              <>
                <Typography variant="subtitle1" gutterBottom>3) Ödeme</Typography>
                <Typography variant="body2">Burada canlı ödeme entegrasyonu yok — örnek olarak "Ödeme yöntemi" seçip devam et.</Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Ödeme Yöntemi</InputLabel>
                  <Select defaultValue="card" label="Ödeme Yöntemi" onChange={() => {}}>
                    <MenuItem value="card">Kredi / Banka Kartı (simülasyon)</MenuItem>
                    <MenuItem value="cash">Kapıda Ödeme</MenuItem>
                    <MenuItem value="transfer">Banka Transferi</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {orderStep === 3 && (
              <>
                <Typography variant="subtitle1" gutterBottom>4) Onay</Typography>
                <Typography>Bilgiler:</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography>Ad: {orderCustomerInfo.name}</Typography>
                  <Typography>Email: {orderCustomerInfo.email}</Typography>
                  <Typography>Adres: {orderCustomerInfo.address}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1">Siparişi onaylamak için "Sipariş Ver" butonuna basın.</Typography>
              </>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={prevOrderStep} disabled={orderStep === 0}>Geri</Button>
            {orderStep < 3 ? (
              <Button variant="contained" onClick={nextOrderStep}>İleri</Button>
            ) : (
              <Button variant="contained" onClick={submitOrders}>Siparişi Ver</Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Questions dialog */}
        <Dialog open={openQuestionDialog} onClose={() => setOpenQuestionDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Satıcıya Soru Sor</DialogTitle>
          <DialogContent>
            <TextField label="Soru" fullWidth multiline minRows={4} value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenQuestionDialog(false)}>İptal</Button>
            <Button variant="contained" onClick={sendQuestion} endIcon={<SendIcon />}>Gönder</Button>
          </DialogActions>
        </Dialog>

        {/* Orders dialog */}
        <Dialog open={openOrdersDialog} onClose={() => setOpenOrdersDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Siparişlerim</DialogTitle>
          <DialogContent>
            {loadingOrders ? <CircularProgress /> : (
              orders.length === 0 ? <Typography>Henüz siparişiniz yok.</Typography> :
              <List>
                {orders.map((o) => (
                  <ListItem key={o._id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText primary={`${o.product?.name || 'Ürün'} x${o.quantity}`} secondary={`Durum: ${o.status} — ${new Date(o.createdAt).toLocaleString()}`} />
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption">Satıcı: {o.seller?.companyName || '—'}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenOrdersDialog(false)}>Kapat</Button>
          </DialogActions>
        </Dialog>

        {/* Messages dialog */}
        <Dialog open={openMessagesDialog} onClose={() => setOpenMessagesDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Mesajlar / Sorular</DialogTitle>
          <DialogContent>
            {loadingQuestions ? <CircularProgress /> : (
              questions.length === 0 ? <Typography>Henüz soru yok.</Typography> :
              <List>
                {questions.map((q) => (
                  <ListItem key={q._id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText primary={q.questionText} secondary={`Tarih: ${new Date(q.createdAt).toLocaleString()}`} />
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color={q.answered ? 'success.main' : 'text.secondary'}>
                        {q.answered ? `Cevap: ${q.answerText || '—'}` : 'Henüz cevaplanmadı'}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMessagesDialog(false)}>Kapat</Button>
          </DialogActions>
        </Dialog>

        {/* Profile dialog */}
        <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Profil</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Ad Soyad" sx={{ mt: 1 }} value={profile.name} onChange={(e) => setProfile(p => ({...p, name: e.target.value}))} />
            <TextField fullWidth label="Email" sx={{ mt: 1 }} value={profile.email} onChange={(e) => setProfile(p => ({...p, email: e.target.value}))} />
            <TextField fullWidth label="Adres (kaydetmek için buton kullan)" sx={{ mt: 1 }} multiline minRows={3} value={profile.address || ''} onChange={(e) => setProfile(p => ({...p, address: e.target.value}))} />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Not: Adres frontend'te localStorage'a kaydedilir. Eğer backend'de profil adresi alanı eklenirse PUT /profile çağrısı ile sunucuya da kaydedebilirim.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProfileDialog(false)}>Kapat</Button>
            <Button variant="contained" onClick={async () => {
              // try to save profile to backend (only name/email/password implemented server-side)
              try {
                await api.put('/profile', { name: profile.name, email: profile.email });
                // local address saved locally
                localStorage.setItem('uc_profile_v1', JSON.stringify({ name: profile.name, email: profile.email, address: profile.address }));
                setSnackbar({ open: true, severity: 'success', message: 'Profil kaydedildi' });
                setOpenProfileDialog(false);
              } catch (err) {
                setSnackbar({ open: true, severity: 'error', message: 'Profil kaydedilemedi' });
              }
            }}>Kaydet</Button>
          </DialogActions>
        </Dialog>

        {/* Search dialog */}
<Dialog
  open={showSearchDialog}
  onClose={() => setShowSearchDialog(false)}
  fullWidth
  maxWidth="lg"
>
  <DialogTitle>Ürün Ara</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      placeholder="Ara..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{ mb: 2 }}
    />
    <Grid container spacing={2}>
      {searchResults.length === 0 ? (
        <Typography>Sonuç yok</Typography>
      ) : (
        searchResults.slice(0, 100).map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card>
              {/* Ürün resmi */}
              <CardMedia
                component="img"
                height="180"
                image={
                  p.images && p.images.length > 0
                    ? p.images[0]
                    : "/no-image.jpg" // yedek resim
                }
                alt={p.name}
                style={{ objectFit: "cover" }}
              />

              {/* Ürün bilgileri */}
              <CardContent>
                <Typography variant="subtitle1">{p.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {p.translations
                    ? p.translations.get("tr")?.descriptionSections?.[0]
                        ?.title || ""
                    : ""}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ mt: 1 }}
                >
                  {p.price} {p.priceCurrency}
                </Typography>
              </CardContent>

              {/* Butonlar */}
              <CardActions>
                <Button
                  size="small"
                  onClick={() =>
                    favorites.includes(p._id)
                      ? handleRemoveFavorite(p._id)
                      : handleAddFavorite(p._id)
                  }
                >
                  {favorites.includes(p._id)
                    ? "Favoride"
                    : "Favorilere Ekle"}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => addToCart(p)}
                >
                  Sepete Ekle
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    openQuestionForProduct(p._id);
                    setShowSearchDialog(false);
                  }}
                >
                  Soru Sor
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  </DialogContent>

<DialogActions>
  <Button
    type="button"
    onClick={() => {
      console.log('Kapat butonuna basılmadan önce:', showSearchDialog);
      setShowSearchDialog(false);
      console.log('Kapat butonuna basıldıktan sonra:', false);
    }}
  >
    Kapat
  </Button>
</DialogActions>

</Dialog>



        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4500} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerHome;
