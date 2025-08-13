// components/HeroSection.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import HeroVideo from '../public/images/herosection.mp4';

const METEOR_COUNT = 25;

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ pathLength: 1, transition: { duration: 1.8, ease: 'easeInOut' } })
      .then(() => setShowVideo(true));
  }, [controls]);

  return (
    <Box
      id="section-0"
      sx={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor: '#111',
        px: 2,
      }}
    >
      {/* Glow Arka Plan */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(0,255,153,0.08), #000)',
          zIndex: 0,
        }}
      />

      {/* Meteor Animasyonu */}
      {Array.from({ length: METEOR_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: Math.random() * window.innerWidth, y: -50, opacity: 0 }}
          animate={{ y: window.innerHeight + 50, opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 5,
          }}
          style={{
            position: 'absolute',
            width: 2,
            height: 12,
            background: 'linear-gradient(180deg, #00ff99, transparent)',
            borderRadius: 1,
            zIndex: 1,
          }}
        />
      ))}

      {/* Başlık ve Açıklama */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {/* Neon Başlık */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontSize: '3rem',
            color: '#00ff99',
            textShadow: '0 0 10px #00ff99, 0 0 20px #00ff99, 0 0 40px #00ff99',
            fontFamily: "'Brush Script MT', cursive",
          }}
        >
          urunler.com
        </motion.h1>

        {/* Açıklama */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ textAlign: 'center' }}
        >
          <Typography sx={{ color: '#00ff99', fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 1 }}>
            🚀 Mağazanızı saniyeler içinde kurun, ürünlerinizi hızlıca yönetin ve satışlarınızı artırın! 💼✨
          </Typography>
          <Typography sx={{ color: '#00ff99', fontSize: { xs: '1rem', md: '1.2rem' } }}>
            👀 Aşağı kaydırarak tüm özelliklerimizi keşfedin
          </Typography>
        </motion.div>

        {/* Video */}
        {showVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ width: '80%', maxWidth: 500, marginTop: 20 }}
          >
            <Box
              component="video"
              autoPlay
              loop
              muted
              playsInline
              sx={{
                width: '100%',
                borderRadius: 3,
                border: '2px solid #00ff99',
                boxShadow: '0 0 50px 15px #00ff99',
              }}
            >
              <source src={HeroVideo} type="video/mp4" />
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Aşağı Kaydırma İpuçları */}
      {showVideo && (
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0, 1, 1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
          style={{
            position: 'absolute',
            bottom: 40,
            color: '#00ff99',
            fontSize: '2.5rem',
            textAlign: 'center',
            zIndex: 2,
            cursor: 'pointer',
          }}
        >
          ⬇️
        </motion.div>
      )}
    </Box>
  );
}
