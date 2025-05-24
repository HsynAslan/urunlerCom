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
     <body style="margin:0; padding:0; background:#f4f6f8;">

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 30px; text-align:center; background:#0052cc; border-radius:8px 8px 0 0; color:#fff;">
        <!-- Onay Iconu -->
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:10px;">
          <circle cx="12" cy="12" r="12" fill="#34a853"/>
          <path d="M17 8L10.5 14.5L7 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1 style="margin:0; font-weight:700; font-size:24px;">Email Doğrulama</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; color:#333; font-size:16px; line-height:1.5;">
        <p>Merhaba,</p>
        <p>Email adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>

        <!-- Buton -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0; width:100%;">
          <tr>
            <td align="center">
              <a href="${verificationUrl}" target="_blank" style="
                background:#0052cc;
                color:#fff;
                text-decoration:none;
                padding: 14px 28px;
                border-radius: 6px;
                font-weight:600;
                display:inline-block;
                min-width:180px;
                font-size:16px;
                ">
                Email Adresini Doğrula
              </a>
            </td>
          </tr>
        </table>

        <p style="color:#666; font-size:14px;">Buton çalışmazsa aşağıdaki bağlantıyı kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
        <p style="word-break:break-word; font-size:14px; color:#0052cc;">${verificationUrl}</p>

        <hr style="border:none; border-top:1px solid #eee; margin:30px 0;" />

        <p style="font-size:12px; color:#999;">
          Bu bağlantı 24 saat sonra geçersiz olacaktır.<br />
          Bu maili siz talep etmediyseniz lütfen dikkate almayın.
        </p>
      </td>
    </tr>
  </table>

</body>
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