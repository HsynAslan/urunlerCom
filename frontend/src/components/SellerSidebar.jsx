// src/components/SellerSidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close,
  Store,
  Business,
  AddBox,
  InsertChart,
  Image,
  Public,
  MonetizationOn,
  CheckCircle,
  Logout,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const SellerSidebar = ({ mobileOpen = false, setMobileOpen = null }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Webde sabit genişlik 240px, mobilde tam genişlik
  const drawerWidth = isMobile ? '100%' : '21%';

  const [openDropdown, setOpenDropdown] = useState(null);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/store`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSeller(res.data);
      } catch (error) {
        console.error('Sidebar seller fetch error:', error);
      }
    };
    fetchSeller();
  }, []);

  const handleDrawerToggle = () => {
    if (setMobileOpen) setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && setMobileOpen) setMobileOpen(false);
  };

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    if (isMobile && setMobileOpen) setMobileOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        height: isMobile ? '70vh' : '100%',
        overflowY: 'auto',
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
        <Typography variant="subtitle1">{seller?.user?.name || 'Loading...'}</Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} color="inherit" aria-label="Close sidebar">
            <Close />
          </IconButton>
        )}
      </Box>

      <Divider />

      <List>
        <ListItemButton onClick={() => toggleDropdown('store')}>
          <ListItemIcon><Store /></ListItemIcon>
          <ListItemText primary={t('sellerSidebar.store')} />
          {openDropdown === 'store' ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDropdown === 'store'} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/company/create')}>
              <ListItemIcon><Business /></ListItemIcon>
              <ListItemText primary={t('sellerSidebar.createCompany')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/products/add')}>
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary={t('sellerSidebar.addProduct')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/products')}>
              <ListItemIcon><AddBox /></ListItemIcon>
              <ListItemText primary={t('sellerSidebar.editProducts')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/about')}>
              <ListItemIcon><InsertChart /></ListItemIcon>
              <ListItemText primary={t('sellerSidebar.aboutPages')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/photos')}>
              <ListItemIcon><Image /></ListItemIcon>
              <ListItemText primary={t('sellerSidebar.photoPages')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/publish-page')}>
              <ListItemIcon><Public /></ListItemIcon>
              <ListItemText primary={t('sellerSidebar.publishPages')} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={() => handleNavigation('/seller/statistics')}>
          <ListItemIcon><InsertChart /></ListItemIcon>
          <ListItemText primary={t('sellerSidebar.statistics')} />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigation('/seller/plans/premium')} >
          <ListItemIcon><MonetizationOn /></ListItemIcon>
         <ListItemText primary={t('sellerSidebar.premiumPlan')} />
        </ListItemButton>

        
       

        <Divider sx={{ my: 2 }} />

        <ListItemButton onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary={t('sellerSidebar.logout')} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={handleDrawerToggle}
      anchor={isMobile ? 'bottom' : 'left'}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          height: isMobile ? '70vh' : '100%',
          boxSizing: 'border-box',
          borderTopLeftRadius: isMobile ? 12 : 0,
          borderTopRightRadius: isMobile ? 12 : 0,
          borderRight: !isMobile ? `1px solid ${theme.palette.divider}` : 'none',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SellerSidebar;
