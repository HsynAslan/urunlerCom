// components/SectionIndicator.jsx
import React, { useEffect, useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

export default function SectionIndicator({ sectionCount = 6 }) {
  const [currentSection, setCurrentSection] = useState(0);
  const theme = useTheme();

  // Scroll durumunu takip et
  useEffect(() => {
    const handleScroll = () => {
      const sections = Array.from({ length: sectionCount }, (_, i) =>
        document.querySelector(`#section-${i}`)
      );
      const scrollPos = window.scrollY + window.innerHeight / 2;

      const current = sections.findIndex((sec) => {
        if (!sec) return false;
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        return scrollPos >= top && scrollPos < bottom;
      });

      if (current !== -1) setCurrentSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // sayfa açıldığında da çalışsın
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionCount]);

  // İlgili section’a scroll
  const goToSection = (index) => {
    const target = document.querySelector(`#section-${index}`);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1300,
        gap: 1,
      }}
    >
      {/* Yukarı ok */}
      <IconButton
        size="small"
        onClick={() => goToSection(Math.max(currentSection - 1, 0))}
        sx={{
          mb: 1,
          bgcolor: theme.palette.background.paper,
          '&:hover': { bgcolor: theme.palette.action.hover },
        }}
      >
        <ArrowUpward fontSize="small" />
      </IconButton>

      {/* Section noktaları */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: sectionCount }).map((_, i) => (
          <Box
            key={i}
            onClick={() => goToSection(i)}
            sx={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              border: `2px solid ${theme.palette.primary.main}`,
              backgroundColor: i === currentSection ? theme.palette.primary.main : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </Box>

      {/* Aşağı ok */}
      <IconButton
        size="small"
        onClick={() => goToSection(Math.min(currentSection + 1, sectionCount - 1))}
        sx={{
          mt: 1,
          bgcolor: theme.palette.background.paper,
          '&:hover': { bgcolor: theme.palette.action.hover },
        }}
      >
        <ArrowDownward fontSize="small" />
      </IconButton>
    </Box>
  );
}
