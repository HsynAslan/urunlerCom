// components/FeaturesOverview.jsx
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const features = [
  { title: 'Kolay Mağaza Kurulumu', desc: 'Sadece birkaç adımda mağazanızı açın.' },
  { title: 'Ürün ve Sipariş Takibi', desc: 'Tüm ürünlerinizi ve siparişlerinizi tek yerden yönetin.' },
  { title: 'Çok Dilli Destek', desc: 'Müşterilerinize birden fazla dilde hizmet verin.' },
  { title: 'Güvenli Ödeme Altyapısı', desc: 'Ödemelerinizi güvenli bir şekilde alın.' },
];

export default function FeaturesOverview() {
  return (
    <Box
      id="section-1"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 6 },
        textAlign: 'center',
        background: 'radial-gradient(circle at bottom, rgba(0,255,153,0.15), #000)',

      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: { xs: 4, md: 8 },
          fontWeight: 700,
        }}
      >
        Öne Çıkan Özelliklerimiz
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  textAlign: 'center',
                  background: '#fff',
                  boxShadow: '0 0 20px 2px rgba(0,255,153,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 0 35px 6px rgba(0,255,153,0.5)',
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  {feature.desc}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
