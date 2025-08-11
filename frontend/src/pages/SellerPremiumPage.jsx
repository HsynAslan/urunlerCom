import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Stack, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerPremiumPage = () => {
  const [seller, setSeller] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/store`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSeller(data);
      } catch {
        toast.error('Satıcı bilgileri alınamadı');
      }
    };
    fetchSeller();
  }, [token]);

  const handleInput = (e) => {
    setCardData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpgrade = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/upgrade-plan`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Premium plana geçildi!');
      setSeller(prev => ({ ...prev, plan: 'premium' }));
    } catch {
      toast.error('Yükseltme başarısız');
    }
  };

  const handleTestCard = () => {
    setCardData({
      number: '4111 1111 1111 1111',
      expiry: '12/30',
      cvv: '123',
      name: 'TEST USER'
    });
    setTimeout(handleUpgrade, 800);
  };

  if (!seller) return <Typography>Yükleniyor...</Typography>;

  if (seller.plan === 'premium') {
    return (
      <Box p={3}>
        <Typography variant="h4">Premium Dashboard</Typography>
        <Typography mt={2}>
          📦 Ürünlerini buradan yönetebilir ve gelen siparişleri görebilirsin.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ background: '#e3f2fd', minHeight: '100vh' }}>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        
        {/* Kredi Kartı Görseli */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              backgroundImage: 'url("/images/bg.png")',
              backgroundSize: 'cover',
              borderRadius: '28px',
              padding: '25px',
              maxWidth: '380px',
              boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
              color: '#fff',
              position: 'relative'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <img src="/images/logo.png" alt="" style={{ width: 48, marginRight: 10 }} />
                <Typography variant="h6">MasterCard</Typography>
              </Box>
              <img src="/images/chip.png" alt="" style={{ width: 60 }} />
            </Box>

            <Box mt={5} display="flex" justifyContent="space-between" alignItems="flex-end">
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Kart Numarası
                </Typography>
                <Typography variant="h6" sx={{ letterSpacing: '1px' }}>
                  {cardData.number || '•••• •••• •••• ••••'}
                </Typography>
                <Typography variant="h6">
                  {cardData.name || 'AD SOYAD'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Geçerlilik Tarihi
                </Typography>
                <Typography variant="h6">
                  {cardData.expiry || 'AA/YY'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Premium Avantajları ve Form */}
        <Grid item xs={12} md={7}>
          <Typography variant="h4" gutterBottom>
            Premium Plan Avantajları
          </Typography>
          <Grid container spacing={2} mb={3}>
            {[
              { title: 'Daha Fazla Ürün', desc: '1000+ ürün ekleyebilme kapasitesi.' },
              { title: 'Öncelikli Destek', desc: '7/24 canlı müşteri desteği.' },
              { title: 'Öne Çıkan Mağaza', desc: 'Anasayfada daha fazla görünürlük.' }
            ].map((f, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Card sx={{ height: '100%', background: '#1976d2', color: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6">{f.title}</Typography>
                    <Typography variant="body2">{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Ödeme Bilgileri
            </Typography>
            <Stack spacing={2}>
              <TextField label="Kart Üzerindeki İsim" name="name" value={cardData.name} onChange={handleInput} />
              <TextField label="Kart Numarası" name="number" value={cardData.number} onChange={handleInput} />
              <Stack direction="row" spacing={2}>
                <TextField label="Son Kullanma" name="expiry" value={cardData.expiry} onChange={handleInput} />
                <TextField label="CVV" name="cvv" value={cardData.cvv} onChange={handleInput} />
              </Stack>
              <Button variant="contained" size="large" onClick={handleUpgrade}>
                Ödemeyi Tamamla
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleTestCard}>
                💳 Test Kartı ile Geçiş Yap
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerPremiumPage;
