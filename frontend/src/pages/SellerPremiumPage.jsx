import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Stack, Paper } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerPremiumPage = () => {
  const [seller, setSeller] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
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
      } catch (err) {
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
    } catch (err) {
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
    setTimeout(handleUpgrade, 800); // 0.8sn sonra premium yap
  };

  if (!seller) return <Typography>Yükleniyor...</Typography>;

  // Eğer premium ise dashboard
  if (seller.plan === 'premium') {
    return (
      <Box p={3}>
        <Typography variant="h4">Premium Dashboard</Typography>
        <Typography mt={2}>📦 Ürünlerini buradan yönetebilir ve gelen siparişleri görebilirsin.</Typography>
      </Box>
    );
  }

  // Premium değilse ödeme ekranı
  return (
    <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>Premium Plan</Typography>
        <Typography mb={3} color="text.secondary">
          Aylık: 99₺ — Yıllık: 999₺ — Tek Seferlik: 2999₺
        </Typography>

        <Stack spacing={2}>
          <TextField label="Kart Üzerindeki İsim" name="name" value={cardData.name} onChange={handleInput} />
          <TextField label="Kart Numarası" name="number" value={cardData.number} onChange={handleInput} />
          <Stack direction="row" spacing={2}>
            <TextField label="Son Kullanma" name="expiry" value={cardData.expiry} onChange={handleInput} />
            <TextField label="CVV" name="cvv" value={cardData.cvv} onChange={handleInput} />
          </Stack>

          <Button variant="contained" onClick={handleUpgrade}>Ödemeyi Tamamla</Button>
          <Button variant="outlined" color="secondary" onClick={handleTestCard}>💳 Test Kartı ile Geçiş Yap</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SellerPremiumPage;
