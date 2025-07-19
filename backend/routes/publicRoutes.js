const express = require('express');
const router = express.Router();

const Seller = require('../models/Seller');
const Product = require('../models/Product');
const SellerAbout = require('../models/SellerAbout');
const SellerPhoto = require('../models/SellerPhoto');
const Theme = require('../models/Theme');

// Satıcının herkese açık sayfası
router.get('/sellers/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    const seller = await Seller.findById(sellerId).populate('theme');
    if (!seller) return res.status(404).json({ message: 'Satıcı bulunamadı' });

    const [products, about, photos] = await Promise.all([
      Product.find({ seller: sellerId, isPublished: true }),
      SellerAbout.findOne({ seller: sellerId }),
      SellerPhoto.find({ seller: sellerId })
    ]);

    res.json({
      companyName: seller.companyName,
      contactInfo: seller.contactInfo || {},
      theme: seller.theme ? {
        name: seller.theme.name,
        cssContent: seller.theme.cssContent
      } : null,
      about: about?.content || '',
      photos: photos || [],
      products: products || [],
    });

  } catch (err) {
    console.error('Public seller fetch error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
