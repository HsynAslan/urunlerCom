import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  Fab,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminSidebar from '../components/AdminSidebar';

const defaultTheme = createTheme();

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f9fafb', paper: '#fff' },
    text: { primary: '#374151', secondary: '#6b7280' },
  },
  shadows: defaultTheme.shadows,
});

const AdminDashboardPage = () => {
  const [admin, setAdmin] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const theme = lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAdmin(data);
        } else {
          console.error('Admin bilgisi alınamadı');
        }
      } catch (error) {
        console.error('Admin bilgisi alınamadı:', error);
      }
    };
    fetchAdmin();
  }, []);

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
        {/* Masaüstünde kalıcı sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: '20%',
              bgcolor: 'background.paper',
              borderRight: `1px solid ${theme.palette.divider}`,
              minHeight: '100vh',
              position: 'relative',
              zIndex: 1300,
            }}
          >
            <AdminSidebar />
          </Box>
        )}

        {/* Mobilde hamburger buton */}
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
            />
          </>
        )}

        {/* İçerik */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: '80%' },
            minHeight: '100vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Hoş geldiniz, {admin?.username || 'Yükleniyor...'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Admin kontrol paneline erişim sağladınız. Soldaki menüyü kullanarak işlemlerinizi gerçekleştirebilirsiniz.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboardPage;
