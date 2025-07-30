const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const SellerAbout = require('../models/SellerAbout');
const SellerPhoto = require('../models/SellerPhoto');
const SiteSettings = require('../models/SiteSettings');
const Theme = require('../models/Theme');

router.get('/site-info', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Site ayarları bulunamadı.' });
    }

    // Public olarak açılacak alanlar
    const publicSettings = {
      maintenanceMode: settings.maintenanceMode || false,
      siteName: settings.siteName || 'Urunlerim.com',
      frontendUrl: settings.frontendUrl || 'http://localhost:3000',
      apiUrl: settings.apiUrl || 'http://localhost:5000',
      socialLinks: settings.socialLinks || {},
      contactPhone: settings.contactPhone || '',
      contactAddress: settings.contactAddress || '',
    };

    res.json(publicSettings);
  } catch (err) {
    console.error('Site info fetch error:', err);
    res.status(500).json({ message: 'Site bilgileri getirilirken hata oluştu.' });
  }
});

router.get('/sellers/:slug/full', async (req, res) => {
  try {
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

    let cssContent = null;

    if (seller.theme && seller.theme.cssFileUrl) {
  // URL'yi düzelt
  let cssUrl = seller.theme.cssFileUrl;
  if (cssUrl.includes('/api/themes/')) {
    cssUrl = cssUrl.replace('/api/themes/', '/public/themes/');
  }

  console.log('Tema CSS dosyası URL (düzeltilmiş):', cssUrl);
  try {
    const cssResponse = await axios.get(cssUrl);
    cssContent = cssResponse.data;
  } catch (err) {
    console.error('Tema CSS dosyası okunamadı:', err.message);
  }
}


    res.json({
      company: {
        companyName: seller.companyName,
        contactInfo: seller.contactInfo || {},
        theme: seller.theme
          ? {
              name: seller.theme.name,
              cssContent,  // CSS içeriği buraya kondu
              cssFileUrl: seller.theme.cssFileUrl,
            }
          : null,
        slug: seller.slug,
        sellerId: seller._id,
        userId: seller.user,
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
