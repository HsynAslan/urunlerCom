const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Token doğrulama middleware

const {createOrder, getCustomerOrders, updateOrderStatus, getPremiumProducts, addFavorite, askQuestion, getProfile, updateProfile} = require('../controllers/orderController');

// Sipariş işlemleri
router.post('/', protect, createOrder);
router.get('/my', protect, getCustomerOrders);
router.put('/:orderId/status', protect, updateOrderStatus);

// Premium ürün listeleme
router.get('/products/premium', getPremiumProducts);

// Favorilere ürün ekleme
router.post('/favorites', protect, addFavorite);

// Satıcıya soru sorma
router.post('/questions', protect, askQuestion);

// Profil işlemleri
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
