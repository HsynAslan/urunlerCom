const nodemailer = require('nodemailer');

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
