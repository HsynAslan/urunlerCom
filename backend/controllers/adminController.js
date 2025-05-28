const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const SiteSettings = require('../models/SiteSettings');
const User = require('../models/User'); // veya doğru path neyse
const Product = require('../models/Product');
const Seller = require('../models/Seller');
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


// Tüm site ayarlarını getir
exports.getAdminSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({}); // Varsayılan boş ayarlar oluştur
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Ayarlar getirilirken bir hata oluştu.' });
  }
};

// Site ayarlarını güncelle
exports.updateAdminSettings = async (req, res) => {
  try {
    const {
      siteName,
      frontendUrl,
      apiUrl,
      mailSettings,
      defaultLanguage,
      maintenanceMode,
      socialLinks,
      contactPhone,
      contactAddress,
      apiEndpoints
    } = req.body;

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings({});
    }

    settings.siteName = siteName || settings.siteName;
    settings.frontendUrl = frontendUrl || settings.frontendUrl;
    settings.apiUrl = apiUrl || settings.apiUrl;
    settings.mailSettings = {
      email: mailSettings?.email || '',
      password: mailSettings?.password || ''
    };
    settings.defaultLanguage = defaultLanguage || 'tr';
    settings.maintenanceMode = maintenanceMode || false;
    settings.socialLinks = socialLinks || {};
    settings.contactPhone = contactPhone || '';
    settings.contactAddress = contactAddress || '';
    settings.apiEndpoints = Array.isArray(apiEndpoints) ? apiEndpoints : [];

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Site ayarları güncellenirken hata oluştu.' });
  }
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

exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  const searchFilter = query
    ? {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      }
    : {};

  try {
    const users = await User.find(searchFilter); // User modelini içe aktar
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcılar getirilirken hata oluştu.' });
  }
};




exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Ürün güncellenemedi', error: error.message });
  }
};

// Satıcının ürünlerini getir
exports.getUserProducts = async (req, res) => {
  try {
    const userId = req.params.userId;

    // User ID ile Seller'ı bul
    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ message: 'Satıcı bulunamadı.' });
    }

    // Seller ID ile ürünleri bul
    const products = await Product.find({ seller: seller._id });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ürünler alınamadı', error: error.message });
  }
};