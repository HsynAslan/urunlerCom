const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();


exports.sendTestMail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"urunlerim.com" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    res.json({ message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,  // 587 portu için false (TLS değil)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendVerificationMail = async (req, res) => {
  try {
    const { to, token } = req.body;

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${to}`;

    const subject = 'Please verify your email';
    const html = `
   <div style="
  max-width: 600px; 
  margin: 40px auto; 
  background: #fff; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
  color: #333;
  padding: 24px 32px;
  line-height: 1.5;
  ">
  <div style="text-align:center; background:#27ae60; border-radius: 8px 8px 0 0; padding: 24px; color: white;">
    <!-- Onay İkonu -->
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:12px; display:inline-block;">
      <circle cx="12" cy="12" r="12" fill="#219150"/>
      <path d="M17 8L10.5 14.5L7 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <h1 style="margin: 0; font-weight: 700; font-size: 22px;">Email Doğrulama</h1>
  </div>

  <p>Merhaba,</p>
  <p>Email adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>

  <div style="text-align:center; margin: 20px 0;">
    <a href="${verificationUrl}" target="_blank" style="
      background:#27ae60;
      color:#fff;
      text-decoration:none;
      padding: 14px 30px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
      ">
      Email Adresini Doğrula
    </a>
  </div>

  <p style="color:#666; font-size: 13px; margin-top: 16px;">
    Buton çalışmazsa aşağıdaki bağlantıyı kopyalayıp tarayıcınıza yapıştırabilirsiniz:
  </p>
  <p style="word-break: break-word; font-size: 13px; color: #27ae60;">
    ${verificationUrl}
  </p>

  <hr style="border:none; border-top:1px solid #eee; margin:30px 0;" />

  <p style="font-size: 12px; color: #999; margin-bottom: 0;">
    Bu bağlantı 24 saat sonra geçersiz olacaktır.<br />
    Bu maili siz talep etmediyseniz lütfen dikkate almayın.
  </p>
</div>

    `;

    await transporter.sendMail({
      from: `"urunlerim.com" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    res.json({ message: 'Verification email sent' });
  } catch (error) {
      console.error('SendVerificationMail error:', error);  // <-- burada
    res.status(500).json({ message: error.message });
  }
};