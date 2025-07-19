const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const axios = require('axios');
const Seller = require('../models/Seller');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      isCustomer: user.isCustomer, // <-- Bunu ekle
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};


exports.register = async (req, res) => {
  try {
    const { name, email, password, isSeller, isCustomer, companyName, slug } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    // User oluştur
    const user = await User.create({
      name,
      email,
      password,
      isSeller,
      isCustomer,
      emailVerificationToken,
      emailVerificationExpires,
      verified: false,
    });

    // Seller ise seller koleksiyonuna da kayıt ekle
    if (isSeller) {
        const tempSlug = slug || `temp-${Date.now()}`; // geçici benzersiz slug
 await Seller.create({
    user: user._id,
    companyName: companyName || '',
    slug: tempSlug,
    contactInfo: { email },
  });
}


    // Customer için de benzer kayıt eklenebilir

    await axios.post(`${process.env.BACKEND_URL}/api/mails/send-verification`, {
      to: email,
      token: emailVerificationToken,
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    // Kullanıcıyı email ile bul
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Token'ı kontrol et (örnek: user.verifyEmailToken alanı veya benzeri)
    if (user.emailVerificationToken !== token) {
  return res.status(400).json({ message: 'Invalid or expired token' });
}
if (user.emailVerificationExpires < Date.now()) {
  return res.status(400).json({ message: 'Token expired' });
}


    // Email doğrulandıysa güncelle
    user.verified = true;
    user.verifyEmailToken = null; // token'ı temizle
    await user.save();

    res.json({ message: 'Email verified successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
