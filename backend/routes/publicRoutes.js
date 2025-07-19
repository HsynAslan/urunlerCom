const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Seller = require('../models/Seller');
const Product = require('../models/Product');
const SellerAbout = require('../models/SellerAbout');
const SellerPhoto = require('../models/SellerPhoto');
const Theme = require('../models/Theme');

// Satıcının şirket bilgileri ve tema (public)
router.get('/public/sellers/:sellerId/store', async (req, res) => {
  try {
    const sellerId = mongoose.Types.ObjectId(req.params.sellerId);
    const seller = await Seller.findById(sellerId).populate('theme');
    if (!seller) return res.status(404).json({ message: 'Satıcı bulunamadı' });
    res.json({
      companyName: seller.companyName,
      contactInfo: seller.contactInfo || {},
      theme: seller.theme
        ? { name: seller.theme.name, cssContent: seller.theme.cssContent }
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Satıcının ürünleri (public)
router.get('/public/sellers/:sellerId/products', async (req, res) => {
  try {
    const sellerId = mongoose.Types.ObjectId(req.params.sellerId);
    const products = await Product.find({ seller: sellerId, isPublished: true });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Satıcının hakkımda metni (public)
router.get('/public/sellers/:sellerId/about', async (req, res) => {
  try {
    const sellerId = mongoose.Types.ObjectId(req.params.sellerId);
    const about = await SellerAbout.findOne({ seller: sellerId });
    if (!about) return res.json({ content: '' });
    res.json(about);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Satıcının fotoğrafları (public)
router.get('/public/sellers/:sellerId/photos', async (req, res) => {
  try {
    const sellerId = mongoose.Types.ObjectId(req.params.sellerId);
    const photos = await SellerPhoto.find({ seller: sellerId });
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});


module.exports = router;
