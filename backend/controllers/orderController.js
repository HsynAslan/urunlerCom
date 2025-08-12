const Order = require('../models/Order');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Question = require('../models/Question');



exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.sellerId }).populate('product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sipariş oluşturma (Sadece premium satıcı ürünleri)
// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { productId, customerName, customerEmail, quantity } = req.body;
    if (!productId || !customerName || !quantity) {
      return res.status(400).json({ message: 'Zorunlu alanlar eksik' });
    }

    const product = await Product.findById(productId).populate('seller');
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

    if (product.seller.plan !== 'premium') {
      return res.status(403).json({ message: 'Sadece premium satıcı ürünleri sipariş verilebilir' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Yeterli stok yok' });
    }

    const order = new Order({
      seller: product.seller._id,
      product: product._id,
      customerName,
      customerEmail,
      quantity,
      status: 'pending',
    });

    await order.save();

    product.stock -= quantity;
    await product.save();

    return res.status(201).json({ message: 'Sipariş oluşturuldu', order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Müşterinin siparişlerini listeleme
// GET /api/orders/my
exports.getCustomerOrders = async (req, res) => {
  try {
    const customerEmail = req.user.email; // Auth middleware ile gelir
    const orders = await Order.find({ customerEmail })
      .populate('product')
      .populate('seller')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Sipariş durumu güncelleme (Sadece satıcı)
// PUT /api/orders/:orderId/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });

    // Satıcı doğrulaması
    if (order.seller.toString() !== req.user.sellerId) {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum' });
    }

    order.status = status;
    await order.save();

    return res.json({ message: 'Durum güncellendi', order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Premium satıcı ürünlerini listeleme
// GET /api/orders/products/premium
exports.getPremiumProducts = async (req, res) => {
  try {
    const premiumSellers = await Seller.find({ plan: 'premium' }).select('_id');
    const products = await Product.find({
      seller: { $in: premiumSellers },
      isPublished: true,
      stock: { $gt: 0 },
    }).populate('seller', 'companyName plan');

    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Favorilere ürün ekleme
// POST /api/orders/favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Ürün ID gerekli' });

    const exists = await Favorite.findOne({ user: userId, product: productId });
    if (exists) return res.status(400).json({ message: 'Zaten favorilere eklenmiş' });

    const fav = new Favorite({ user: userId, product: productId });
    await fav.save();

    return res.json({ message: 'Favorilere eklendi' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Satıcıya soru sorma
// POST /api/orders/questions
exports.askQuestion = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { sellerId, productId, questionText } = req.body;
    if (!sellerId || !questionText) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik' });
    }

    const question = new Question({
      customer: customerId,
      seller: sellerId,
      product: productId,
      questionText,
      answered: false,
    });

    await question.save();

    return res.json({ message: 'Soru gönderildi' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı profil bilgilerini getirme
// GET /api/orders/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı profil güncelleme
// PUT /api/orders/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // hash işlemi modelde yapılmalı

    await user.save();

    return res.json({ message: 'Profil güncellendi' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcının favorilerini getirme
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('product', 'name price images') // product bilgileri
      .sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Favoriler alınırken hata:', error);
    res.status(500).json({ message: 'Favoriler alınırken bir hata oluştu.' });
  }
};

// Kullanıcının sorduğu soruları getirme
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ customer: req.user._id })
      .populate('seller', 'companyName')
      .populate('product', 'name price images')
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Sorular alınırken hata:', error);
    res.status(500).json({ message: 'Sorular alınırken bir hata oluştu.' });
  }
};