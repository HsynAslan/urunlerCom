import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Stack,
  Fab,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';

const SiteSettingsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [settings, setSettings] = useState({
    siteName: '',
    frontendUrl: '',
    apiUrl: '',
    mailSettings: { email: '', password: '' },
    defaultLanguage: 'tr',
    maintenanceMode: false,
    socialLinks: {},
    contactPhone: '',
    contactAddress: '',
    apiEndpoints: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('site');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/settings`,
          { headers }
        );
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleMailChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      mailSettings: { ...prev.mailSettings, [field]: value },
    }));
  };

  const handleSocialChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value },
    }));
  };

  const handleApiChange = (index, field, value) => {
    const newEndpoints = [...settings.apiEndpoints];
    newEndpoints[index][field] = value;
    setSettings((prev) => ({ ...prev, apiEndpoints: newEndpoints }));
  };

  const addApiEndpoint = () => {
    setSettings((prev) => ({
      ...prev,
      apiEndpoints: [
        ...(prev.apiEndpoints || []),
        { name: '', path: '', method: '', description: '' },
      ],
    }));
  };

  const removeApiEndpoint = (index) => {
    setSettings((prev) => ({
      ...prev,
      apiEndpoints: prev.apiEndpoints.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/settings`,
        settings,
        { headers }
      );
      alert('Kaydedildi!');
    } catch (err) {
      alert('Hata oluştu!');
    }
  };

  if (loading)
    return (
      <Box p={4}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );

  return (
    <>
      {/* Masaüstünde kalıcı sidebar */}
      {!isMobile && <AdminSidebar />}

      {/* Mobilde hamburger ve drawer */}
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
          width: isMobile ? '100%' : '75%',
          marginLeft: isMobile ? 0 : 'auto',
          padding: 0,
          paddingY: 3,
          marginTop: isMobile ? 0 : 0,
          backgroundColor: 'rgba(249, 250, 251, 0.7)',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Site Ayarları Paneli
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            variant={activeTab === 'site' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('site')}
          >
            Site Ayarları
          </Button>
          <Button
            variant={activeTab === 'social' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('social')}
          >
            Sosyal Medya
          </Button>
          <Button
            variant={activeTab === 'api' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('api')}
          >
            API Uç Noktaları
          </Button>
        </Box>

        {activeTab === 'site' && (
          <Stack spacing={2}>
            <TextField
              label="Site Adı"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Frontend URL"
              name="frontendUrl"
              value={settings.frontendUrl}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="API URL"
              name="apiUrl"
              value={settings.apiUrl}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Mail"
              value={settings.mailSettings?.email || ''}
              onChange={(e) => handleMailChange('email', e.target.value)}
              fullWidth
            />
            <TextField
              label="Mail Şifresi"
              type="password"
              value={settings.mailSettings?.password || ''}
              onChange={(e) => handleMailChange('password', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Varsayılan Dil</InputLabel>
              <Select
                name="defaultLanguage"
                value={settings.defaultLanguage}
                label="Varsayılan Dil"
                onChange={handleChange}
              >
                <MenuItem value="tr">Türkçe</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      maintenanceMode: e.target.checked,
                    }))
                  }
                />
              }
              label="Bakım Modu"
            />
            <TextField
              label="Telefon"
              name="contactPhone"
              value={settings.contactPhone || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Adres"
              name="contactAddress"
              value={settings.contactAddress || ''}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        )}

        {activeTab === 'social' && (
          <Stack spacing={2}>
            <TextField
              label="Facebook"
              name="facebook"
              value={settings.socialLinks?.facebook || ''}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              fullWidth
            />
            <TextField
              label="Twitter"
              name="twitter"
              value={settings.socialLinks?.twitter || ''}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              fullWidth
            />
          </Stack>
        )}

        {activeTab === 'api' && (
          <Stack spacing={3}>
            {settings.apiEndpoints?.map((api, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, position: 'relative' }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems="center"
                >
                  <TextField
                    label="Adı"
                    value={api.name}
                    onChange={(e) =>
                      handleApiChange(index, 'name', e.target.value)
                    }
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Yol"
                    value={api.path}
                    onChange={(e) =>
                      handleApiChange(index, 'path', e.target.value)
                    }
                    sx={{ flex: 1 }}
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Yöntem</InputLabel>
                    <Select
                      value={api.method}
                      label="Yöntem"
                      onChange={(e) =>
                        handleApiChange(index, 'method', e.target.value)
                      }
                    >
                      <MenuItem value="">Seçin</MenuItem>
                      <MenuItem value="GET">GET</MenuItem>
                      <MenuItem value="POST">POST</MenuItem>
                      <MenuItem value="PUT">PUT</MenuItem>
                      <MenuItem value="DELETE">DELETE</MenuItem>
                      <MenuItem value="PATCH">PATCH</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Açıklama"
                    value={api.description}
                    onChange={(e) =>
                      handleApiChange(index, 'description', e.target.value)
                    }
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeApiEndpoint(index)}
                    aria-label="Sil"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
            <Button variant="outlined" onClick={addApiEndpoint}>
              Yeni API Ekle
            </Button>
          </Stack>
        )}

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Kaydet
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SiteSettingsPage;
