const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');  // Seller modelini projenizdeki yola göre düzeltin
const Product = require('../models/Product');

// Public seller bilgisi ve ürünleri
router.get('/sellers/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Satıcı bulunamadı' });
    }

    const products = await Product.find({ seller: sellerId });

    res.json({
      companyName: seller.companyName,
      about: seller.about,
      photos: seller.photos || [],
      products,
      // Diğer seller bilgileri eklenebilir
    });
  } catch (error) {
    console.error('Public seller fetch error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
