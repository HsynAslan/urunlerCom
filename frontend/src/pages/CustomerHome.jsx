import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 280;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#e0e0e0', secondary: '#b0b0b0' },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f4f6f8', paper: '#fff' },
    text: { primary: '#222', secondary: '#555' },
  },
});

const CustomerHome = () => {
  // Tema durumu
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  // Responsive kontrol
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Veri durumları
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]); // productId listesi
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '' });

  // Loading & snackbar
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Soru formu modal
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questionProductId, setQuestionProductId] = useState(null);

  // --- Yardımcı fonksiyonlar ---
  const getToken = () => localStorage.getItem('token');

  const api = axios.create({
    baseURL: 'https://urunlercom.onrender.com/api/orders',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // Sidebar aç/kapa
  const toggleDrawer = () => setMobileOpen((prev) => !prev);

  // Tema değiştir
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Backend'den premium ürünleri çek
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get('/products/premium');
      setProducts(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Ürünler yüklenemedi', severity: 'error' });
    }
    setLoadingProducts(false);
  };

  // Favorileri getir veya boş al (örnek, kendi API'n varsa kullanabilirsin)
  const fetchFavorites = async () => {
    // Burada basit boş liste ile başlatıyorum,
    // isteğe göre backend endpoint eklenmeli
    setFavorites([]);
  };

  // Sepete ürün ekle (aynı ürün varsa miktarı artır)
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.product._id === product._id);
      if (exist) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setSnackbar({ open: true, message: `${product.name} sepete eklendi`, severity: 'success' });
  };

  // Favorilere ürün ekle
  const addFavorite = async (productId) => {
    if (favorites.includes(productId)) return;
    try {
      await api.post('/favorites', { productId });
      setFavorites((prev) => [...prev, productId]);
      setSnackbar({ open: true, message: 'Favorilere eklendi', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Favorilere eklenemedi', severity: 'error' });
    }
  };

  // Sipariş oluştur
  const createOrder = async (item) => {
    try {
      const { product, quantity } = item;
      await api.post('/', {
        productId: product._id,
        customerName: profile.name,
        customerEmail: profile.email,
        quantity,
      });
      setSnackbar({ open: true, message: 'Sipariş başarıyla oluşturuldu', severity: 'success' });
      // Siparişler güncellenir
      fetchOrders();
      // Sepetten çıkar
      setCart((prev) => prev.filter((i) => i.product._id !== product._id));
    } catch (err) {
      setSnackbar({ open: true, message: 'Sipariş oluşturulamadı', severity: 'error' });
    }
  };

  // Müşteri siparişlerini çek
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/my');
      setOrders(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Siparişler yüklenemedi', severity: 'error' });
    }
    setLoadingOrders(false);
  };

  // Profil bilgilerini getir
  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile({ name: res.data.name, email: res.data.email });
    } catch {
      setSnackbar({ open: true, message: 'Profil bilgileri alınamadı', severity: 'error' });
    }
  };

  // Soru formu aç/kapa
  const openQuestionForm = (productId) => {
    setQuestionProductId(productId);
    setQuestionText('');
    setQuestionOpen(true);
  };
  const closeQuestionForm = () => setQuestionOpen(false);

  // Satıcıya soru gönder
  const sendQuestion = async () => {
    if (!questionText.trim()) {
      setSnackbar({ open: true, message: 'Lütfen soru girin', severity: 'warning' });
      return;
    }

    try {
      // Ürün objesinden sellerId alıyoruz
      const product = products.find((p) => p._id === questionProductId);
      if (!product) throw new Error('Ürün bulunamadı');

      await api.post('/questions', {
        sellerId: product.seller._id,
        productId: questionProductId,
        questionText,
      });
      setSnackbar({ open: true, message: 'Soru gönderildi', severity: 'success' });
      setQuestionOpen(false);
    } catch {
      setSnackbar({ open: true, message: 'Soru gönderilemedi', severity: 'error' });
    }
  };

  // Component mount'da verileri çek
  useEffect(() => {
    fetchProducts();
    fetchFavorites();
    fetchOrders();
    fetchProfile();
  }, []);

  // Sidebar içeriği (hedefler + sepet + siparişler)
  const drawerContent = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        🎯 Hedeflerimiz
      </Typography>
      <List dense>
        {[
          'Satıcılardan ürünleri görüntüleme',
          'Ürünleri favorilere ekleyebilme',
          'Satıcılara soru sorabilme',
          'Sipariş oluşturabilme ve takip edebilme',
          'Kullanıcı profili üzerinden kişisel bilgileri yönetme',
          'Güvenli ödeme ve iade süreci takibi',
        ].map((goal, i) => (
          <ListItem key={i}>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={goal} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Sepet ({cart.length})
      </Typography>
      {cart.length === 0 && <Typography variant="body2">Sepetiniz boş</Typography>}
      <List dense sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {cart.map((item) => (
          <ListItem
            key={item.product._id}
            secondaryAction={
              <Button
                variant="contained"
                size="small"
                onClick={() => createOrder(item)}
              >
                Sipariş Ver
              </Button>
            }
          >
            <ListItemText
              primary={item.product.name}
              secondary={`Adet: ${item.quantity} - Fiyat: ${item.product.price} ${item.product.priceCurrency}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Siparişler
      </Typography>
      {loadingOrders && <CircularProgress size={24} />}
      {!loadingOrders && orders.length === 0 && (
        <Typography variant="body2">Henüz siparişiniz yok</Typography>
      )}
      <List dense sx={{ maxHeight: 200, overflowY: 'auto' }}>
        {orders.map((order) => (
          <ListItem key={order._id}>
            <ListItemText
              primary={`${order.product.name} (x${order.quantity})`}
              secondary={`Durum: ${order.status} - Tarih: ${new Date(
                order.createdAt
              ).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          color="primary"
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              📦 Müşteri Paneli
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="sidebar"
        >
          {/* Mobile drawer */}
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={toggleDrawer}
              ModalProps={{ keepMounted: true }}
              sx={{
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer
              variant="permanent"
              open
              sx={{
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawerContent}
            </Drawer>
          )}
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: '64px',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Premium Satıcı Ürünleri
          </Typography>
          {loadingProducts ? (
            <CircularProgress />
          ) : (
            <List>
              {products.map((product) => {
                const isFavorite = favorites.includes(product._id);

                return (
                  <ListItem
                    key={product._id}
                    sx={{
                      mb: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: 1,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                    divider
                  >
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography color="primary" fontWeight="600">
                        {product.price} {product.priceCurrency}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 1, width: '100%' }}>
                      <Button
                        startIcon={<FavoriteIcon />}
                        variant={isFavorite ? 'contained' : 'outlined'}
                        color="error"
                        onClick={() => addFavorite(product._id)}
                        disabled={isFavorite}
                        sx={{ mr: 1 }}
                      >
                        {isFavorite ? 'Favoride' : 'Favorilere Ekle'}
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => addToCart(product)}
                      >
                        Sepete Ekle
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<QuestionAnswerIcon />}
                        onClick={() => openQuestionForm(product._id)}
                        sx={{ ml: 1 }}
                      >
                        Satıcıya Soru Sor
                      </Button>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* Profil Bilgileri */}
          <Box sx={{ mt: 6, maxWidth: 480 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Profil Bilgileri
            </Typography>
            <Typography>Adı: {profile.name}</Typography>
            <Typography>Email: {profile.email}</Typography>
          </Box>
        </Box>

        {/* Soru Formu Dialog */}
        <Dialog open={questionOpen} onClose={closeQuestionForm}>
          <DialogTitle>
            Satıcıya Soru Sor
            <IconButton
              aria-label="close"
              onClick={closeQuestionForm}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="Sorunuz"
              type="text"
              fullWidth
              multiline
              minRows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={sendQuestion} variant="contained" fullWidth>
              Gönder
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerHome;
