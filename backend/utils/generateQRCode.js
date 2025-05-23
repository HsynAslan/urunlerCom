const QRCode = require('qrcode');

const generateQRCode = async (text) => {
  try {
    const qr = await QRCode.toDataURL(text);
    return qr;
  } catch (err) {
    throw new Error('QR kod üretimi başarısız: ' + err.message);
  }
};

module.exports = generateQRCode;
