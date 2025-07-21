const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Seller = require('../models/Seller');
const Product = require('../models/Product');
const SellerAbout = require('../models/SellerAbout');
const SellerPhoto = require('../models/SellerPhoto');

const Theme = require('../models/Theme');


// Tüm public satıcı verisini tek seferde dönen endpoint
router.get('/sellers/:sellerId/full', async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.params.sellerId);

    const seller = await Seller.findById(sellerId).populate('theme');
    if (!seller) return res.status(404).json({ message: 'Satıcı bulunamadı' });

    const userId = seller.user;

    const [products, about, photos] = await Promise.all([
      Product.find({ seller: sellerId, isPublished: true }),
      SellerAbout.findOne({ seller: userId }),
      SellerPhoto.find({ seller: userId }),
    ]);

    res.json({
      company: {
        companyName: seller.companyName,
        contactInfo: seller.contactInfo || {},
        theme: seller.theme
          ? { name: seller.theme.name, cssContent: seller.theme.cssContent }
          : null,
      },
      products,
      about: about || { content: '' },
      photos,
    });
  } catch (err) {
    console.error('Public full seller data error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.get('/sellers/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('Slug:', slug);
    // Slug ile seller bul
    const seller = await Seller.findOne({ slug }).populate('theme');
    if (!seller) return res.status(404).json({ message: 'Satıcı bulunamadı' });

    const sellerId = seller._id;
    const userId = seller.user;

    // İlgili verileri çek
    const [products, about, photos] = await Promise.all([
      Product.find({ seller: sellerId, isPublished: true }),
      SellerAbout.findOne({ seller: userId }),
      SellerPhoto.find({ seller: userId }),
    ]);

    res.json({
      company: {
        companyName: seller.companyName,
        contactInfo: seller.contactInfo || {},
        theme: seller.theme
          ? { name: seller.theme.name, cssContent: seller.theme.cssContent }
          : null,
      },
      products,
      about: about || { content: '' },
      photos,
    });
  } catch (err) {
    console.error('Slug bazlı seller verisi hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
