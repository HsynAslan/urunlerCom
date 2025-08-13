// components/VideoPlayer.jsx
import React from 'react';

export default function VideoPlayer({ src }) {
  return (
   <video
  src={src}
  autoPlay
  loop
  muted
  playsInline
  style={{
    width: '100%',
    height: 'auto', // oran bozulmaz
    maxHeight: '350px',
    borderRadius: '12px',
    objectFit: 'cover'
  }}
/>

  );
}
