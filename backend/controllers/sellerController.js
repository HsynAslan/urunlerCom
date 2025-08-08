const Seller = require('../models/Seller');
const SellerAbout = require('../models/SellerAbout');
const SellerPhoto = require('../models/SellerPhoto');
const Theme = require('../models/Theme');
require('dotenv').config();
const Order = require('../models/Order'); // Örnek: Satışlar, siparişler modelin varsa
const Product = require('../models/Product'); // Ürün modeli
const SellerStats = require('../models/SellerStats');

exports.getSellerInfo = async (req, res) => {
  try {
    console.log('User ID:', req.user.id);

    const seller = await Seller.findOne({ user: req.user.id })
      .populate({ path: 'theme', select: 'name previewImage' })
      .populate({ path: 'user', select: 'name email' }); // 👈 user bilgilerini dahil et

    console.log('Seller Info:', seller);

    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getStats = async (req, res) => {
  try {
    // Seller'ı bul (user id üzerinden)
    const seller = await Seller.findOne({ user: req.user.id });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    const sellerId = seller._id;

    // SellerStats'tan tüm kayıtları çek (istersen belli bir tarih aralığı ile filtrele)
    const statsRecords = await SellerStats.find({ seller: sellerId });

    // Gelen kayıtları toplayarak tek bir toplam istatistik objesi yap
    const aggregatedStats = statsRecords.reduce(
      (acc, record) => {
        acc.totalVisits += record.totalVisits || 0;
        acc.phoneClicks += record.phoneClicks || 0;
        acc.locationClicks += record.locationClicks || 0;
        acc.qrDownloads += record.qrDownloads || 0;
        acc.ordersPlaced += record.ordersPlaced || 0;
        acc.totalDuration += (record.averageDuration || 0) * 1; // saniye cinsinden ortalama sürelerin toplamı (ortalama için ileride kullanılabilir)
        acc.recordCount += 1;
        return acc;
      },
      {
        totalVisits: 0,
        phoneClicks: 0,
        locationClicks: 0,
        qrDownloads: 0,
        ordersPlaced: 0,
        totalDuration: 0,
        recordCount: 0,
      }
    );

    // Ortalama sayfada kalma süresi (tüm kayıtların ortalaması)
    const averageDuration = aggregatedStats.recordCount > 0
      ? aggregatedStats.totalDuration / aggregatedStats.recordCount
      : 0;

    // Toplam ürün sayısı ve toplam satışları yine ilgili modellerden alabiliriz
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const totalSales = await Order.countDocuments({ seller: sellerId, status: 'completed' });

    // Toplam gelir
    const completedOrders = await Order.aggregate([
      { $match: { seller: sellerId, status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = completedOrders.length > 0 ? completedOrders[0].totalRevenue : 0;

    res.json({
      totalProducts,
      totalSales,
      totalRevenue,
      totalVisits: aggregatedStats.totalVisits,
      phoneClicks: aggregatedStats.phoneClicks,
      locationClicks: aggregatedStats.locationClicks,
      qrDownloads: aggregatedStats.qrDownloads,
      ordersPlaced: aggregatedStats.ordersPlaced,
      averageDuration, // saniye cinsinden
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSellerInfo = async (req, res) => {
  try {
    const updates = req.body;
    const seller = await Seller.findOneAndUpdate({ user: req.user.id }, updates, {
      new: true,
    });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    // Örnek olarak basit istatistik verisi döndürüyoruz
    const stats = {
      totalProducts: 100,
      totalSales: 50,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.checkSlug = async (req, res) => {
  try {
    const { slug } = req.body;
    if (!slug || !/^[a-zA-Z0-9-_]+$/.test(slug)) {
      return res.status(400).json({ message: 'Geçersiz slug formatı.' });
    }

    const existing = await Seller.findOne({ slug });
    if (existing) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (err) {
    console.error('Slug kontrol hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


exports.selectSchema = async (req, res) => {
  try {
    const userId = req.user._id;
    const { schemaId, slug } = req.body;

    if (!schemaId) {
      return res.status(400).json({ message: 'schemaId gönderilmedi.' });
    }

  
    // Slug başka biri tarafından kullanılıyor mu?
    const existingSeller = await Seller.findOne({ slug });
    if (existingSeller) {
      return res.status(400).json({ message: 'Bu URL (slug) zaten kullanılıyor. Lütfen başka bir tane deneyin.' });
    }

    // Tema ID'si geçerli mi?
    const theme = await Theme.findById(schemaId);
    if (!theme) {
      return res.status(404).json({ message: 'Seçilen tema bulunamadı.' });
    }

    // Güncelleme işlemi
    const updatedSeller = await Seller.findOneAndUpdate(
      { user: userId },
      { theme: schemaId, slug },
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller bulunamadı.' });
    }

    const publishedUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/${updatedSeller.slug}`;

    res.json({ message: 'Tema ve URL başarıyla kaydedildi.', publishedUrl });

  } catch (error) {
    console.error('Şema seçme hatası:', error);
    res.status(500).json({ message: 'Şema seçilirken hata oluştu.' });
  }
};


exports.createOrGetSeller = async (req, res) => {
  try {
    let seller = await Seller.findOne({ user: req.user.id })
      .populate({ path: 'theme', select: 'name previewImage' })
      .populate({ path: 'user', select: 'name email' });

    if (!seller) {
      seller = new Seller({ user: req.user.id });
      await seller.save();
    }

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getSellerAbout = async (req, res) => {
  try {
    const about = await SellerAbout.findOne({ seller: req.user.id });
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ message: 'Hakkımda bilgisi alınamadı' });
  }
};

exports.updateSellerAbout = async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await SellerAbout.findOneAndUpdate(
      { seller: req.user.id },
      { content },
      { upsert: true, new: true }
    );
    console.log('Updated About:', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Hakkımda bilgisi güncellenemedi' });
  }
};

exports.getSellerPhotos = async (req, res) => {
  try {
    const photos = await SellerPhoto.find({ seller: req.user.id });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Fotoğraflar alınamadı' });
  }
};

exports.addSellerPhoto = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    const newPhoto = new SellerPhoto({
      seller: req.user.id,
      imageUrl,
      caption,
    });
    await newPhoto.save();
    res.json(newPhoto);
  } catch (err) {
    res.status(500).json({ message: 'Fotoğraf eklenemedi' });
  }
};

exports.deleteSellerPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SellerPhoto.findOneAndDelete({ _id: id, seller: req.user.id });
    if (!result) return res.status(404).json({ message: 'Fotoğraf bulunamadı' });
    res.json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silme işlemi başarısız' });
  }
};
