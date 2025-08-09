import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminSidebar from '../components/AdminSidebar';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f4f6f9', paper: '#ffffff' },
    text: { primary: '#2f3e46', secondary: '#607d8b' },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f4f6f9', paper: '#ffffff' },
    text: { primary: '#2f3e46', secondary: '#607d8b' },
  },
});

const AdminUsers = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [products, setProducts] = useState([]);
  const [savingProductIds, setSavingProductIds] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Kullanıcıları çek
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/users?query=${query}`,
        { headers }
      );
      setUsers(res.data);
    } catch (err) {
      console.error('Kullanıcılar alınamadı:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);

  // Seçilen kullanıcı satıcıysa ürünleri getir
  useEffect(() => {
    if (selectedUser?.isSeller) {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/users/${selectedUser._id}/products`,
          { headers }
        )
        .then((res) => setProducts(res.data))
        .catch((err) => console.error('Ürünler alınamadı:', err));
    } else {
      setProducts([]);
    }
  }, [selectedUser]);

  const grouped = {
    sellers: users.filter((u) => u.isSeller),
    customers: users.filter((u) => u.isCustomer),
  };

  const getUserRole = (user) => {
    if (user.isSeller) return 'Satıcı';
    if (user.isCustomer) return 'Müşteri';
    if (user.isAdmin) return 'Yönetici';
    return 'Tanımsız';
  };

  const handleProductChange = (index, field, value) => {
    setProducts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleProductSave = async (index) => {
    const product = products[index];
    try {
      setSavingProductIds((ids) => [...ids, product._id]);
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/products/${product._id}`,
        product,
        { headers }
      );
      alert('Ürün kaydedildi.');
    } catch (err) {
      console.error('Ürün kaydedilemedi:', err);
      alert('Ürün kaydedilirken hata oluştu.');
    } finally {
      setSavingProductIds((ids) => ids.filter((id) => id !== product._id));
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
              borderRight: `2px solid ${darkMode ? '#3f51b5' : '#cfd8dc'}`,
              p: 2,
            }}
          >
            <AdminSidebar />
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
            position: 'relative',
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Kullanıcı Yönetimi
          </Typography>

          <TextField
            placeholder="İsim veya e-posta ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          />

          {loadingUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Satıcılar
                </Typography>
                {grouped.sellers.length === 0 && <Typography>Satıcı bulunamadı.</Typography>}
                {grouped.sellers.map((user) => (
                  <Box
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: selectedUser?._id === user._id ? 'primary.light' : 'background.paper',
                      mb: 1,
                    }}
                  >
                    {user.name} ({user.email})
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Müşteriler
                </Typography>
                {grouped.customers.length === 0 && <Typography>Müşteri bulunamadı.</Typography>}
                {grouped.customers.map((user) => (
                  <Box
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: selectedUser?._id === user._id ? 'primary.light' : 'background.paper',
                      mb: 1,
                    }}
                  >
                    {user.name} ({user.email})
                  </Box>
                ))}
              </Box>
            </>
          )}

          {selectedUser && (
            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                maxHeight: '70vh',
                overflowY: 'auto',
              }}
            >
              <Typography variant="h5" gutterBottom>
                {selectedUser.name}
              </Typography>
              <Typography>E-posta: {selectedUser.email}</Typography>
              <Typography>Rol: {getUserRole(selectedUser)}</Typography>

              {selectedUser.isSeller && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Ürünleri
                  </Typography>
                  {products.length === 0 && <Typography>Bu satıcının ürünü yok.</Typography>}
                  {products.map((product, i) => (
                    <Box
                      key={product._id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <TextField
                        label="İsim"
                        value={product.name}
                        onChange={(e) => handleProductChange(i, 'name', e.target.value)}
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        label="Slug"
                        value={product.slug}
                        onChange={(e) => handleProductChange(i, 'slug', e.target.value)}
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        label="Fiyat"
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductChange(i, 'price', parseFloat(e.target.value))}
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                      <Select
                        label="Para Birimi"
                        value={product.priceCurrency}
                        onChange={(e) => handleProductChange(i, 'priceCurrency', e.target.value)}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        <MenuItem value="TRY">TRY</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                      </Select>
                      <TextField
                        label="Stok"
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleProductChange(i, 'stock', parseInt(e.target.value))}
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                      <Select
                        label="Stok Birimi"
                        value={product.stockUnit}
                        onChange={(e) => handleProductChange(i, 'stockUnit', e.target.value)}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        <MenuItem value="adet">adet</MenuItem>
                        <MenuItem value="ml">ml</MenuItem>
                        <MenuItem value="g">g</MenuItem>
                        <MenuItem value="kg">kg</MenuItem>
                      </Select>
                      <Button
                        variant="contained"
                        onClick={() => handleProductSave(i)}
                        disabled={savingProductIds.includes(product._id)}
                      >
                        {savingProductIds.includes(product._id) ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                    </Box>
                  ))}
                </>
              )}

              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setSelectedUser(null)}>
                Kapat
              </Button>
            </Box>
          )}

          {/* Tema değiştirici */}
          <Box
            sx={{
              position: 'fixed',
              display: 'none',
              bottom: 32,
              left: 32,
              zIndex: 1600,
            }}
          >
            <Button
              onClick={() => setDarkMode((prev) => !prev)}
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
              title={darkMode ? 'Açık Tema' : 'Koyu Tema'}
            >
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};


export default AdminUsers;
