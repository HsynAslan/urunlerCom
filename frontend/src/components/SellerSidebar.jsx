import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
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

const drawerWidth = 240;

const SellerSidebar = ({
  mobileOpen = false,
  setMobileOpen = null,
  variant = 'permanent',
  anchor = 'left',
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');

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

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    if (isMobile && setMobileOpen) setMobileOpen(false);
  };

  const drawerContent = (
    <>
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
        {variant === 'temporary' && (
          <IconButton onClick={handleDrawerToggle} color="inherit" aria-label="Close sidebar">
            <Close />
          </IconButton>
        )}
      </Box>

      <Divider />

      <List sx={{ overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
        <ListItemButton onClick={() => toggleDropdown('store')}>
          <ListItemIcon>
            <Store />
          </ListItemIcon>
          <ListItemText primary={t('sellerSidebar.store')} />
          {openDropdown === 'store' ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDropdown === 'store'} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/company/create')}>
              <ListItemIcon>
                <Business />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.createCompany')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/products/add')}>
              <ListItemIcon>
                <AddBox />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.addProduct')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/products')}>
              <ListItemIcon>
                <AddBox />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.editProducts')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/about')}>
              <ListItemIcon>
                <InsertChart />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.aboutPages')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/photos')}>
              <ListItemIcon>
                <Image />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.photoPages')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/publish-page')}>
              <ListItemIcon>
                <Public />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.publishPages')} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={() => handleNavigation('/seller/statistics')}>
          <ListItemIcon>
            <InsertChart />
          </ListItemIcon>
          <ListItemText primary={t('sellerSidebar.statistics')} />
        </ListItemButton>

        <ListItemButton onClick={() => toggleDropdown('plans')}>
          <ListItemIcon>
            <MonetizationOn />
          </ListItemIcon>
          <ListItemText primary={t('sellerSidebar.plans')} />
          {openDropdown === 'plans' ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDropdown === 'plans'} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/plans/free')}>
              <ListItemIcon>
                <CheckCircle />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.freePlan')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/plans/premium')}>
              <ListItemIcon>
                <CheckCircle />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.premiumPlan')} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/seller/plans/business')}>
              <ListItemIcon>
                <CheckCircle />
              </ListItemIcon>
              <ListItemText primary={t('sellerSidebar.businessPlan')} />
            </ListItemButton>
          </List>
        </Collapse>

        <Divider sx={{ my: 2 }} />

        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary={t('sellerSidebar.logout')} />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <Drawer
      variant={variant}
      open={variant === 'temporary' ? mobileOpen : true}
      onClose={handleDrawerToggle}
      anchor={anchor}
      ModalProps={{
        keepMounted: true, // Performans için
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SellerSidebar;
