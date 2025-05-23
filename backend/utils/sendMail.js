const nodemailer = require('nodemailer');

const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || undefined, // örn: "gmail"
    host: process.env.SMTP_HOST || undefined,       // gmail kullanmazsan burası
    port: process.env.SMTP_PORT || 587,
    secure: false, // TLS için true yapabilirsin (gmail 465 portu)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"urunlerim.com" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = sendMail;

