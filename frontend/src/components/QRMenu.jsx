import React, { useState, useRef } from 'react';
import { Box, IconButton, Button, Dialog, DialogContent, DialogTitle, Slide, Typography } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeCanvas } from 'qrcode.react';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

const QRMenu = ({ url, companyName }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const qrRef = useRef();

  const handleDownload = () => {
    try {
      const canvas = qrRef.current.querySelector('canvas');
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${companyName || 'qr-code'}.png`;
      link.click();
    } catch (err) {
      console.error('QR kod indirilemedi:', err);
    }
  };

  return (
    <>
      {/* Sabit Kırmızı Kare */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Slide direction="right" in={openMenu} mountOnEnter unmountOnExit>
          <Box
            sx={{
              bgcolor: 'white',
              boxShadow: 3,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              gap: 1,
            }}
          >
            <Button variant="outlined" size="small" onClick={() => setOpenDialog(true)}>
              QR Görüntüle
            </Button>
            <Button variant="outlined" size="small" onClick={handleDownload}>
              QR İndir
            </Button>
          </Box>
        </Slide>

        <IconButton
          sx={{
            bgcolor: 'red',
            color: 'white',
            '&:hover': { bgcolor: 'darkred' },
            width: 48,
            height: 48,
          }}
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          {openMenu ? <CloseIcon /> : <QrCode2Icon />}
        </IconButton>
      </Box>

      {/* QR Görüntüleme Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24 }}>
          {companyName || 'Şirket Adı'}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <div ref={qrRef}>
            <QRCodeCanvas
              value={url}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              includeMargin
            />
          </div>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PhoneIphoneIcon sx={{ fontSize: 40, color: 'gray' }} />
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Telefonunuzla QR’yi tarayabilirsiniz
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRMenu;
