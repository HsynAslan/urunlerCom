// components/FooterSection.jsx
import React from 'react';
import { Box, Typography, Link, IconButton, Grid, Paper } from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function FooterSection() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh', // sayfanın tamamını kaplar
        bgcolor: '#1e1e1e', // üstte kalan boş alanlar da bu renk
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end', // footer içeriği alta yapışır
        px: { xs: 0, md: 6 },
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        elevation={6}
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 6 }, // mobilde padding azaltıldı
          bgcolor: '#121212', // footer içi arka plan
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <Grid
          container
          spacing={4}
          direction={{ xs: 'column', md: 'row' }} // mobilde alt alta
        >
          {/* Logo & Hakkımızda */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              urunler.com
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#ccc' }}>
              Mağazanızı kolayca yönetin ve satışlarınızı artırın. Hızlı, güvenli ve çok dilli destek ile her zaman yanınızdayız.
            </Typography>
          </Grid>

          {/* Hızlı Linkler */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Hızlı Linkler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { text: 'Anasayfa', href: '#section-0' },
                { text: 'Özellikler', href: '#features-overview' },
                { text: 'Fiyatlar', href: '#pricing-section' },
                { text: 'İletişim', href: '#contact-section' },
              ].map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  underline="hover"
                  sx={{
                    color: '#ccc',
                    transition: 'color 0.3s ease',
                    '&:hover': { color: '#00ff99' },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Sosyal Medya */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Bizi Takip Edin
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <Facebook />, href: 'https://facebook.com' },
                { icon: <Instagram />, href: 'https://instagram.com' },
                { icon: <Twitter />, href: 'https://twitter.com' },
              ].map((social, i) => (
                <IconButton
                  key={i}
                  href={social.href}
                  target="_blank"
                  sx={{
                    color: '#ccc',
                    transition: 'all 0.3s ease',
                    '&:hover': { color: '#00ff99', transform: 'scale(1.1)' },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Alt Kısım */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" sx={{ color: '#777' }}>
            &copy; {new Date().getFullYear()} urunler.com. Tüm hakları saklıdır.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
