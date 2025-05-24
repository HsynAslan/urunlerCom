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

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}&email=${to}`;

    const subject = 'Please verify your email';
    const html = `
      <p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>
      <p>This link expires in 1 hour.</p>
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