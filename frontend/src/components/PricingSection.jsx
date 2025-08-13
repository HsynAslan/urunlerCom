// components/PricingSection.jsx
import React from 'react';
import { Box, Typography, Card, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const pricingPlans = [
  {
    title: 'Aylık Plan',
    price: '199₺ / ay',
    duration: 'Her ay yenilenir',
    features: ['Sınırsız Mağaza', 'Sınırsız Ürün', '7/24 Destek'],
  },
  {
    title: 'Yıllık Plan',
    price: '1999₺ / yıl',
    duration: 'Yılda 1 kez ödenir (2 ay bedava)',
    features: ['Sınırsız Mağaza', 'Sınırsız Ürün', '7/24 Destek'],
  },
  {
    title: 'Süresiz Plan',
    price: '2999₺',
    duration: 'Tek seferlik ödeme',
    features: ['Sınırsız Mağaza', 'Sınırsız Ürün', '7/24 Destek'],
  },
];

export default function PricingSection() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 0, md: 6 },
        py: { xs: 2, md: 0 },
        bgcolor: '#1e1e1e',
        position: 'relative',
      }}
    >
      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', marginBottom: 40, width: '100%' }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.8rem', md: '3rem' },
            color: '#00ff99',
          }}
        >
          Fiyat Planları
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            fontSize: { xs: '0.95rem', md: '1.25rem' },
            color: '#ccc',
          }}
        >
          İhtiyacınıza uygun süreyi seçin, tüm avantajlardan yararlanın.
        </Typography>
      </motion.div>

      {/* Kartlar */}
<Box
  sx={{
    width: '100%',
    display: { xs: 'flex', md: 'block' }, // mobilde yatay kaydırma, webde block
    overflowX: { xs: 'auto', md: 'visible' },
   
    
    gap: 3,
    px: { xs: 2, md: 0 },
    scrollSnapType: { xs: 'x mandatory', md: 'none' },
    '&::-webkit-scrollbar': { display: 'none' },
  }}
>



        <Grid
          container
          spacing={3}
          sx={{
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'center' }, // mobil ve web ortalanmış
          }}
        >
          {pricingPlans.map((plan, index) => (
            <Grid
              item
              key={plan.title}
              xs={12}
              md={4} // webde 3 yan yana
              sx={{
                flex: { xs: '0 0 80%', md: '0 0 auto' }, // mobilde kaydırma için genişlik
                scrollSnapAlign: { xs: 'center', md: 'none' },
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    p: { xs: 3, md: 5 },
                    textAlign: 'center',
                    bgcolor: '#121212',
                    color: '#fff',
                    boxShadow: '0 0 30px 6px rgba(0,255,153,0.7)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 0 40px 10px rgba(0,255,153,0.9)',
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, mb: 1, color: '#00ff99' }}
                  >
                    {plan.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: '#aaa' }}>
                    {plan.duration}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    {plan.features.map((feature) => (
                      <Typography key={feature} variant="body1" sx={{ mb: 1 }}>
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
