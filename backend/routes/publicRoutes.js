const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Seller = require('../models/Seller');
const Product = require('../models/Product');
const SellerAbout = require('../models/SellerAbout');
const SellerPhoto = require('../models/SellerPhoto');

const Theme = require('../models/Theme');


router.get('/sellers/:slug/full', async (req, res) => {
  try {
    console.log('Full seller data request for slug:', req.params.slug);
    const slug = req.params.slug;
    
    const seller = await Seller.findOne({ slug }).populate('theme');
    if (!seller) return res.status(404).json({ message: 'Satıcı bulunamadı' });

    const userId = seller.user;
    const sellerId = seller._id;

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
        slug: seller.slug,
        sellerId: seller._id,     // 🔧 sellerId eklendi
        userId: seller.user,      // (isteğe bağlı) userId da eklenebilir
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
