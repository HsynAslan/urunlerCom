const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const SiteSettings = require('../models/SiteSettings');
require('dotenv').config();
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};

exports.createSubAdmin = async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles)) {
    return res.status(400).json({ message: 'Geçersiz veriler' });
  }

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await Admin.create({ username, password: hashedPassword, roles });

  res.status(201).json({ message: 'Alt admin oluşturuldu', admin: newAdmin });
};


exports.getAdminSettings = async (req, res) => {
  const settings = await SiteSettings.findOne();
  res.json(settings);
};

exports.updateAdminSettings = async (req, res) => {
  const { siteName, backgroundImage, apiUrl } = req.body;
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = new SiteSettings({ siteName, backgroundImage, apiUrl });
  } else {
    settings.siteName = siteName;
    settings.backgroundImage = backgroundImage;
    settings.apiUrl = apiUrl;
  }

  await settings.save();
  res.json(settings);
};

exports.getMe = async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({ message: 'Yetkisiz' });
  }

  res.status(200).json({
    id: req.admin._id,
    username: req.admin.username,
    roles: req.admin.roles,
  });
};