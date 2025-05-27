const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const SiteSettings = require('../models/SiteSettings');

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
  const existing = await Admin.findOne({ username });
  if (existing) return res.status(400).json({ message: 'Admin already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newAdmin = await Admin.create({ username, password: hashed, roles });
  res.json(newAdmin);
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
