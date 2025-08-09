import React, { useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Fab,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const rolesList = [
  'manage_admins',
  'edit_site_settings',
  'manage_users',
  'view_everything',
  'edit_theme',
  'super_admin',
];

const CreateSubAdminPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [message, setMessage] = useState('');

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/subadmin`,
        { username, password, roles: selectedRoles },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Alt admin başarıyla oluşturuldu!');
      setUsername('');
      setPassword('');
      setSelectedRoles([]);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Bir hata oluştu');
    }
  };

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
          paddingY: 4,
          paddingX: 0,
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Alt Admin Oluştur
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            <Box>
              <Typography variant="subtitle1" mb={1}>
                Roller:
              </Typography>
              <Stack spacing={1}>
                {rolesList.map((role) => (
                  <FormControlLabel
                    key={role}
                    control={
                      <Checkbox
                        checked={selectedRoles.includes(role)}
                        onChange={() => toggleRole(role)}
                      />
                    }
                    label={role}
                  />
                ))}
              </Stack>
            </Box>

            <Button type="submit" variant="contained" fullWidth>
              Oluştur
            </Button>
          </Stack>
        </Box>

        {message && (
          <Typography
            mt={3}
            color={message.includes('başarıyla') ? 'success.main' : 'error.main'}
          >
            {message}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default CreateSubAdminPage;
