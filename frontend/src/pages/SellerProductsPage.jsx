import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import axios from 'axios';
import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import Spinner from '../components/Spinner';
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

const SellerProductsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/products/mine`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(data);
      } catch (err) {
        setError(t('productList.loadError'));
        toast.error('❌ Ürünler alınırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [t]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        price: editingProduct.price || '',
        stock: editingProduct.stock || '',
      });
    }
  }, [editingProduct]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleDelete = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('✅ Ürün başarıyla silindi');
    } catch (err) {
      toast.error('❌ Ürün silinirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedProduct = {
        ...editingProduct,
        name: formData.name,
        price: formData.price,
        stock: formData.stock,
      };

      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/products/${editingProduct._id}`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === data._id ? data : p))
      );
      toast.success('✅ Ürün güncellendi');
      setEditingProduct(null);
    } catch (err) {
      toast.error('❌ Güncelleme başarısız');
    }
  };

  if (loading) return <Spinner />;

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
            width: { xs: '100%', md: '80%' },
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1500 }}>
            <LanguageSelector />
          </Box>

          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            📦 {t('productList.title', 'Ürün Listesi')}
          </Typography>

          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
              gap: 3,
            }}
          >
            {products.map((product) => (
              <Paper
                key={product._id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 4,
                  backgroundColor: 'background.paper',
                }}
              >
                <img
                  src={product.images[product.showcaseImageIndex || 0]}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }}
                />
                <Typography variant="h6" mt={1}>
                  {product.name}
                </Typography>
                <Typography variant="body2">
                  💸 {product.price} {product.priceCurrency || '₺'}
                </Typography>
                <Typography variant="body2">
                  📦 {product.stock} {product.stockUnit}
                </Typography>
                <Box mt={1} sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => setEditingProduct(product)}>
                    ✏️ {t('productList.edit')}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      if (window.confirm(t('productList.confirmDelete'))) handleDelete(product._id);
                    }}
                  >
                    🗑️ {t('productList.delete')}
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
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

        {/* Düzenleme Modalı */}
        <Dialog
          open={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Ürünü Düzenle</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              fullWidth
              name="name"
              label="Ürün Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              margin="dense"
              fullWidth
              name="price"
              label="Fiyat"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <TextField
              margin="dense"
              fullWidth
              name="stock"
              label="Stok"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingProduct(null)}>İptal</Button>
            <Button onClick={handleSave} variant="contained">
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default SellerProductsPage;
