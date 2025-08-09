import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Palette,
  Visibility,
  Group,
  FactCheck,
  PersonAdd,
  Logout,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const drawerWidth = 240;

const AdminSidebar = ({ mobileOpen = false, setMobileOpen = null }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [open, setOpen] = useState(!isMobile); // masaüstü açık, mobil kapalı başlangıç
  const [admin, setAdmin] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (error) {
        console.error('Admin fetch failed:', error);
      }
    };
    fetchAdmin();
  }, []);

  // Responsive değişince otomatik open ayarla
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const hasRole = (role) => admin?.roles?.includes(role);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
    if (isMobile && setMobileOpen) setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen((prev) => !prev);
    }
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        bgcolor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="subtitle1" noWrap>
          {admin?.username || 'Admin'}
        </Typography>
        {isMobile ? (
          <IconButton onClick={handleDrawerToggle} color="inherit" aria-label="close sidebar" size="small">
            <ChevronLeft />
          </IconButton>
        ) : (
          <IconButton onClick={handleDrawerToggle} color="inherit" aria-label="toggle sidebar" size="small">
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        )}
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {hasRole('edit_site_settings') && (
          <ListItemButton onClick={() => navigate('/admin/site-settings')}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Site Ayarları" />
          </ListItemButton>
        )}

        {hasRole('edit_theme') && (
          <ListItemButton onClick={() => navigate('/admin/theme')}>
            <ListItemIcon>
              <Palette />
            </ListItemIcon>
            <ListItemText primary="Tema Ayarları" />
          </ListItemButton>
        )}

        {hasRole('view_everything') && (
          <ListItemButton onClick={() => navigate('/admin/overview')}>
            <ListItemIcon>
              <Visibility />
            </ListItemIcon>
            <ListItemText primary="Genel Görünüm" />
          </ListItemButton>
        )}

        {hasRole('manage_users') && (
          <ListItemButton onClick={() => navigate('/admin/users')}>
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText primary="Kullanıcı Yönetimi" />
          </ListItemButton>
        )}

        {hasRole('check_products') && (
          <ListItemButton onClick={() => navigate('/admin/products/review')}>
            <ListItemIcon>
              <FactCheck />
            </ListItemIcon>
            <ListItemText primary="Ürün İnceleme" />
          </ListItemButton>
        )}

        {hasRole('manage_admins') && (
          <>
            <ListItemButton onClick={() => toggleDropdown('admins')}>
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Alt Adminler" />
              {openDropdowns['admins'] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openDropdowns['admins']} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItemButton onClick={() => navigate('/admin/subadmin/list')}>
                  <ListItemText primary="Admin Listesi" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/admin/subadmin/create')}>
                  <ListItemText primary="Yeni Admin Ekle" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ bgcolor: theme.palette.error.main, color: theme.palette.error.contrastText, '&:hover': { bgcolor: theme.palette.error.dark } }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Çıkış Yap" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : open}
      onClose={handleDrawerToggle}
      anchor="left"
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AdminSidebar;
