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
exports.contentReview = async (req, res) => {
  try {
    const { company, products, about, photos } = req.body;

    let score = 0;
    const recommendations = [];

    // Şirket bilgileri kontrolü
    if (company?.companyName && company.companyName.trim().length > 2) {
      score += 20;
    } else {
      recommendations.push('Şirket adı eksik veya çok kısa, daha açıklayıcı bir isim girin.');
    }

    if (company?.contactInfo?.phone) {
      score += 10;
    } else {
      recommendations.push('İletişim telefonu eksik, mutlaka ekleyin.');
    }

    if (company?.contactInfo?.email) {
      score += 10;
    } else {
      recommendations.push('İletişim e-posta adresi ekleyin.');
    }

    if (company?.contactInfo?.address) {
      score += 10;
    } else {
      recommendations.push('Şirket adresi eksik.');
    }

    // Ürünler kontrolü
    if (Array.isArray(products) && products.length > 0) {
      score += 20;
      const missingInfoProducts = products.filter(p => !p.name || !p.price);
      if (missingInfoProducts.length > 0) {
        recommendations.push('Bazı ürünlerde isim veya fiyat bilgisi eksik.');
      }
    } else {
      recommendations.push('En az bir ürün ekleyin.');
    }

    // Hakkında yazısı kontrolü
    if (about && about.trim().length >= 50) {
      score += 20;
    } else {
      recommendations.push('Hakkında kısmını en az 50 karakter olacak şekilde detaylandırın.');
    }

    // Fotoğraflar kontrolü
    if (Array.isArray(photos) && photos.length >= 3) {
      score += 10;
    } else {
      recommendations.push('En az 3 adet fotoğraf ekleyin, görsel içerik sayfanızı güçlendirir.');
    }

    // Toplam skoru %100'e tamamla (max 100)
    if (score > 100) score = 100;

    return res.status(200).json({
      success: true,
      score,
      recommendations,
    });
  } catch (error) {
    console.error('Content review error:', error);
    return res.status(500).json({
      success: false,
      message: 'İçerik değerlendirmesi sırasında hata oluştu.',
    });
  }
};

exports.fullGetStats = async (req, res) => {
  try {
    console.log('Request started for getStats');

    // Seller'ı bul (user id üzerinden)
    const seller = await Seller.findOne({ user: req.user.id });
    console.log('Seller found:', seller);

    if (!seller) {
      console.log('Seller not found for user:', req.user.id);
      return res.status(404).json({ message: 'Seller not found' });
    }

    const sellerId = seller._id;

    // SellerStats'tan tüm kayıtları çek
    const statsRecords = await SellerStats.find({ seller: sellerId });
    console.log('Stats records:', statsRecords);

    // Gelen kayıtları toplayarak tek bir toplam istatistik objesi yap
    const aggregatedStats = statsRecords.reduce(
      (acc, record) => {
        acc.totalVisits += record.totalVisits || 0;
        acc.phoneClicks += record.phoneClicks || 0;
        acc.locationClicks += record.locationClicks || 0;
        acc.qrDownloads += record.qrDownloads || 0;
        acc.ordersPlaced += record.ordersPlaced || 0;
        acc.totalDuration += (record.averageDuration || 0) * 1;
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
    console.log('Aggregated stats:', aggregatedStats);

    // Ortalama sayfada kalma süresi
    const averageDuration = aggregatedStats.recordCount > 0
      ? aggregatedStats.totalDuration / aggregatedStats.recordCount
      : 0;
    console.log('Average duration:', averageDuration);

    // Toplam ürün sayısı
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    console.log('Total products:', totalProducts);

    // Toplam satış sayısı
    const totalSales = await Order.countDocuments({ seller: sellerId, status: 'completed' });
    console.log('Total sales:', totalSales);

    // Toplam gelir
    const completedOrders = await Order.aggregate([
      { $match: { seller: sellerId, status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = completedOrders.length > 0 ? completedOrders[0].totalRevenue : 0;
    console.log('Total revenue:', totalRevenue);

    const response = {
      totalProducts,
      totalSales,
      totalRevenue,
      totalVisits: aggregatedStats.totalVisits,
      phoneClicks: aggregatedStats.phoneClicks,
      locationClicks: aggregatedStats.locationClicks,
      qrDownloads: aggregatedStats.qrDownloads,
      ordersPlaced: aggregatedStats.ordersPlaced,
      averageDuration, // saniye cinsinden
    };
    console.log('Response JSON:', response);

    res.json(response);
  } catch (error) {
    console.error('Error in getStats:', error);
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
