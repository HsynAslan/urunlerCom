// components/ScrollHandler.jsx
import React, { useEffect, useRef } from 'react';

export default function ScrollHandler({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Smooth scroll ve section snap için CSS ekleyelim
    container.style.scrollBehavior = 'smooth';
    container.style.height = '100vh';
    container.style.overflowY = 'scroll';
    container.style.scrollSnapType = 'y mandatory';

    const sections = Array.from(container.children);
    sections.forEach((section) => {
      section.style.scrollSnapAlign = 'start';
      section.style.height = '100vh';
    });

    // Mouse wheel scroll handling (isteğe bağlı: hız veya momentum ayarı)
    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollBy({
        top: e.deltaY,
        behavior: 'smooth',
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
