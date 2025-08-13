// components/FeatureDetailSection.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, Modal, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function FeatureDetailSection({ feature }) {
  const [openVideo, setOpenVideo] = useState(false);

  const handleOpen = () => setOpenVideo(true);
  const handleClose = () => setOpenVideo(false);

  const getFeatureContent = (feature) => {
    switch (feature) {
      case 'Kolay Mağaza Kurulumu':
        return {
          title: 'Kolay Mağaza Kurulumu 🛒',
          description: [
            '✅ Satıcı üye ol',
            '📝 Mağaza sayfasından bilgilerini gir',
            '📦 Ürünlerini (varsa) ekle',
            '🚀 Sayfanı yayınla',
            '🎉 İşte bu kadar! Artık sana özgü sayfan hazır.',
          ],
          videoSrc: '/store-setup.mkv'
        };
      case 'Ürün ve Sipariş Takibi':
        return {
          title: 'Ürün ve Sipariş Takibi 📦',
          description: [
            '🌟 Premium avantajlarından faydalan',
            '🛒 Site üzerinden müşterilerin sipariş verebilir',
            '📊 Dashboard sayfandan yönet',
            '📈 Şirket istatistiklerini görüntüle',
            '👀 Ziyaretçi ve sipariş durumlarını takip et',
          ],
          videoSrc: '/order-dashboard.mkv',
        };
      case 'Çok Dilli Destek':
        return {
          title: 'Çok Dilli Destek 🌍',
          description: [
            '🗣️ Farklı dillerde sitemizi kullan',
            '🌐 Dünyaya açıl',
            '💼 Global müşterilere kolay erişim sağla',
          ],
          videoSrc: '/multi-language.mkv',
        };
      case 'Güvenli Ödeme Altyapısı':
        return {
          title: 'Admin Paneli 🛠️',
          description: [
            '🗄️ Tüm altyapı bilgilerini yönet',
            '👤 Admin oluştur',
            '🎨 Tema ekle ve özelleştir',
            '🔌 API entegrasyonlarını yönet',
            '📊 Dashboard ile kontrol sağla',
          ],
          videoSrc: '/admin-dashboard.mkv',
        };
      default:
        return {
          title: feature,
          description: ['Bu özelliği açıklamak için detaylar burada olacak.'],
          videoSrc: null,
        };
    }
  };

  const content = getFeatureContent(feature);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 0, md: 6 }, // mobilde padding 0
        bgcolor: '#1e1e1e',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ width: '100%', maxWidth: 1100 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 0, md: 4 }, // mobilde padding azaltıldı
            borderRadius: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // mobilde dikey
            alignItems: 'center',
            background: '#121212',
            boxShadow: '0 0 30px 6px rgba(0,255,153,0.7)',
            width: '100%', // mobilde tam genişlik
          }}
        >
          {/* Video solda / mobilde üstte */}
          {content.videoSrc && (
            <Box
              sx={{
                flex: 1,
                mr: { md: 4 },
                mb: { xs: 2, md: 0 },
                width: { xs: '100%', md: 'auto' },
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={handleOpen}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <VideoPlayer src={content.videoSrc} />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#00ff99',
                  }}
                >
                  <PlayArrowIcon fontSize="large" />
                </IconButton>
              </motion.div>
            </Box>
          )}

          {/* Açıklama sağda / mobilde altta */}
          <Box
            sx={{
              flex: 2,
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#00ff99' }}>
              {content.title}
            </Typography>
            <ul style={{ paddingLeft: '1rem', color: '#e0e0e0' }}>
              {content.description.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  {item}
                </li>
              ))}
            </ul>
          </Box>
        </Paper>

        {/* Video modal */}
        <Modal open={openVideo} onClose={handleClose} closeAfterTransition>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              p: 2,
            }}
          >
            <VideoPlayer src={content.videoSrc} />
          </Box>
        </Modal>
      </motion.div>
    </Box>
  );
}
