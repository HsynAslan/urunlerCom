import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useScrollTrigger,
  Zoom,
} from '@mui/material';
import { styled, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LanguageSelector from '../components/LanguageSelector';
import Spinner from '../components/Spinner';

// Neon renkler
const neonGreen = '#39ff14';
const neonRed = '#ff073a';

const backgroundMainDark = '#0e1a2b';
const backgroundMainLight = '#f0f0f0';
const buttonBgDark = '#162f4a';
const buttonBgLight = '#e0e0e0';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: backgroundMainDark,
      paper: '#112240',
    },
    primary: { main: '#2196f3' },
    success: { main: neonGreen, contrastText: '#000' },
    error: { main: neonRed, contrastText: '#000' },
    text: { primary: '#e0e0e0', secondary: '#bbbbbb' },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: {
      fontWeight: '900',
      letterSpacing: '0.1em',
      textShadow: `
        0 0 8px ${neonGreen}, 
        0 0 20px ${neonGreen}, 
        0 0 30px ${neonGreen}, 
        0 0 40px ${neonGreen}
      `,
      animation: 'flicker 3s infinite alternate',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          backgroundColor: buttonBgDark,
          color: '#e0e0e0',
          boxShadow: `0 0 10px 3px rgba(57, 255, 20, 0.6)`,
          transition: 'box-shadow 1s ease-in-out, background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#1f4571',
            boxShadow: `0 0 20px 6px ${neonGreen}`,
          },
        },
        containedSuccess: {
          boxShadow: `0 0 8px 3px ${neonGreen}`,
          animation: 'rotateGlow 4s linear infinite',
          backgroundColor: buttonBgDark,
          '&:hover': { backgroundColor: '#1f4571' },
        },
        containedError: {
          boxShadow: `0 0 8px 3px ${neonRed}`,
          animation: 'rotateGlowRed 4s linear infinite',
          backgroundColor: buttonBgDark,
          '&:hover': { backgroundColor: '#4a1520' },
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: backgroundMainLight,
      paper: '#ffffff',
    },
    primary: { main: '#1976d2' },
    success: { main: '#4caf50', contrastText: '#fff' },
    error: { main: '#f44336', contrastText: '#fff' },
    text: { primary: '#000000', secondary: '#444444' },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: {
      fontWeight: '900',
      letterSpacing: '0.1em',
      color: '#1976d2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          backgroundColor: buttonBgLight,
          color: '#000',
          boxShadow: 'none',
          transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#a5d6f9',
            boxShadow: 'none',
          },
        },
      },
    },
  },
});

// Global stiller (aynı, flicker vs. dark temaya uygun)
const GlobalStyles = styled('style')`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap');

  @keyframes flicker {
    0%,
    100% {
      text-shadow: 0 0 8px ${neonGreen}, 0 0 20px ${neonGreen}, 0 0 30px ${neonGreen};
    }
    50% {
      text-shadow: 0 0 10px ${neonGreen}, 0 0 25px ${neonGreen}, 0 0 40px ${neonGreen};
    }
  }

  @keyframes rotateGlow {
    0% {
      box-shadow: 0 0 8px 3px ${neonGreen};
    }
    50% {
      box-shadow: 0 0 20px 6px ${neonGreen};
    }
    100% {
      box-shadow: 0 0 8px 3px ${neonGreen};
    }
  }

  @keyframes rotateGlowRed {
    0% {
      box-shadow: 0 0 8px 3px ${neonRed};
    }
    50% {
      box-shadow: 0 0 20px 6px ${neonRed};
    }
    100% {
      box-shadow: 0 0 8px 3px ${neonRed};
    }
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  @keyframes blinkCaret {
    0%, 100% { border-color: transparent; }
    50% { border-color: ${neonGreen}; }
  }

  .typing-animation {
    font-family: 'Dancing Script', cursive;
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid ${neonGreen};
    width: 0;
    animation: typing 3s steps(30, end) forwards, blinkCaret 0.75s step-end infinite;
  }

  /* register-form ve modal stiller buraya aynen kopyalanabilir */
`;

function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });

  const handleClick = (event) => {
    const anchor =
      (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Tema state'i: true ise koyu, false ise açık
  const [darkMode, setDarkMode] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isSeller: false,
    isCustomer: false,
  });

  const [modalType, setModalType] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const termsRef = useRef(null);

  const handleSellerClick = (e) => {
    const checked = e.target.checked;
    if (checked && !termsAccepted) {
      e.preventDefault();
      setModalType("seller");
      setShowTermsModal(true);
    } else {
      setFormData(prev => ({
        ...prev,
        isSeller: checked,
        isCustomer: false,
      }));
    }
  };

  const handleCustomerClick = (e) => {
    const checked = e.target.checked;
    if (checked && !termsAccepted) {
      e.preventDefault();
      setModalType("customer");
      setShowTermsModal(true);
    } else {
      setFormData(prev => ({
        ...prev,
        isCustomer: checked,
        isSeller: false,
      }));
    }
  };

  useEffect(() => {
    if (showTermsModal) setTermsAccepted(false);
  }, [showTermsModal]);

  const handleAcceptTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleCloseModal = () => {
    if (!termsAccepted) {
      alert(t('RegisterPage.pleaseAcceptTerms'));
      return;
    }

    if (modalType === 'seller') {
      setFormData(prev => ({ ...prev, isSeller: true, isCustomer: false }));
    } else if (modalType === 'customer') {
      setFormData(prev => ({ ...prev, isCustomer: true, isSeller: false }));
    }

    setShowTermsModal(false);
    setModalType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = { ...formData };

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/auth/register`;
      await axios.post(url, dataToSend);

      setLoading(false);
      setShowVerificationModal(true);

      setFormData({
        name: '',
        email: '',
        password: '',
        isSeller: false,
        isCustomer: false,
      });
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || 'Bir hata oluştu');
    }
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Box
        sx={{
          bgcolor: 'background.default',
          
          color: 'text.primary',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          py: 4,
        }}
      >
        <Box id="back-to-top-anchor" />

      

        {/* Dil Seçici - Mobilde sol üstte sabit */}
        {isMobile && (
          <Box
           
          >
            <LanguageSelector />
          </Box>
        )}

        <Container maxWidth="sm" sx={{ flexGrow: 1 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: '900', color: neonGreen, mb: 3, textAlign: 'center' }}
            className="typing-animation"
          >
           
          </Typography>

          {loading && <Spinner />}

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <input
              type="text"
              name="name"
              placeholder={t('RegisterPage.name')}
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              autoComplete="name"
              style={{ backgroundColor: darkMode ? '#112240' : '#fff', color: darkMode ? '#e0e0e0' : '#000' }}
            />
            <input
              type="email"
              name="email"
              placeholder={t('RegisterPage.email')}
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              autoComplete="email"
              style={{ backgroundColor: darkMode ? '#112240' : '#fff', color: darkMode ? '#e0e0e0' : '#000' }}
            />
            <input
              type="password"
              name="password"
              placeholder={t('RegisterPage.password')}
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              autoComplete="new-password"
              style={{ backgroundColor: darkMode ? '#112240' : '#fff', color: darkMode ? '#e0e0e0' : '#000' }}
            />

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <input
                type="checkbox"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleSellerClick} style={{ width: '20px', height: '20px' }}
              />
              <Typography component="span">{t('RegisterPage.isSeller')}</Typography>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <input
                type="checkbox"
                name="isCustomer"
                checked={formData.isCustomer}
                onChange={handleCustomerClick} style={{ width: '20px', height: '20px' }}
              />
              <Typography component="span">{t('RegisterPage.isCustomer')}</Typography>
            </label>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 3, fontWeight: 'bold', animation: darkMode ? 'rotateGlow 4s linear infinite' : 'none' }}
            >
              {t('RegisterPage.registerButton')}
            </Button>
          </form>
        </Container>

        {/* Modal ve ScrollTop bölümü önceki mesajdaki gibi... */}

        {/* Hizmet Şartları Modalı */}
        {showTermsModal && (
          <Box className="modal-overlay">
            <Box className="modal-content" sx={{ backgroundColor: darkMode ? '#112240' : '#fff', color: darkMode ? '#e0e0e0' : '#000' }}>
              <Typography variant="h5" sx={{ color: darkMode ? neonGreen : '#1976d2' }}>
                {t('RegisterPage.termsTitle')}
              </Typography>
              <Box
                className="terms-text"
                ref={termsRef}
                sx={{
                  height: 200,
                  overflowY: 'auto',
                  border: '1px solid #ccc',
                  padding: 2,
                  my: 2,
                  backgroundColor: darkMode ? '#0e1a2b' : '#f9f9f9',
                  color: darkMode ? '#e0e0e0' : '#000',
                }}
              >
                {t('RegisterPage.termsText')}
              </Box>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, mb: 2 }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={handleAcceptTermsChange} style={{ width: '20px', height: '20px' }}
                />
                <Typography component="span">{t('RegisterPage.acceptTerms')}</Typography>
              </label>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  disabled={!termsAccepted}
                  onClick={handleCloseModal}
                  sx={{ mr: 2 }}
                  variant="contained"
                  color="success"
                >
                  {t('RegisterPage.confirm')}
                </Button>
                <Button
                  onClick={() => setShowTermsModal(false)}
                  variant="contained"
                  color="error"
                >
                  {t('RegisterPage.cancel')}
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Doğrulama modalı */}
        {showVerificationModal && (
          <Box className="modal-overlay">
            <Box className="modal-content" sx={{ textAlign: 'center', backgroundColor: darkMode ? '#112240' : '#fff', color: darkMode ? '#e0e0e0' : '#000' }}>
              <Typography variant="h5" gutterBottom sx={{ color: darkMode ? neonGreen : '#1976d2' }}>
                {t('RegisterPage.verificationSentTitle')}
              </Typography>

              <Box sx={{ margin: '20px auto', maxWidth: 300 }}>
                <video
                  src="/images/mail-send.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>

              <Typography sx={{ mb: 2 }}>{t('RegisterPage.verificationSentMessage')}</Typography>
              <Button variant="contained" color="success" onClick={() => setShowVerificationModal(false)}>
                {t('RegisterPage.ok')}
              </Button>
            </Box>
          </Box>
        )}

        {/* Scroll Top */}
        <ScrollTop>
          <Button
            color="success"
            size="small"
            aria-label="scroll back to top"
            sx={{
              animation: darkMode ? 'rotateGlow 4s linear infinite' : 'none',
              backgroundColor: darkMode ? buttonBgDark : buttonBgLight,
              boxShadow: darkMode ? `0 0 10px 3px ${neonGreen}` : 'none',
              '&:hover': {
                backgroundColor: darkMode ? '#1f4571' : '#a5d6f9',
                boxShadow: darkMode ? `0 0 25px 7px ${neonGreen}` : 'none',
              },
              borderRadius: '50%',
              minWidth: '40px',
              minHeight: '40px',
              padding: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <KeyboardArrowUpIcon />
          </Button>
        </ScrollTop>
      </Box>
    </ThemeProvider>
  );
}
