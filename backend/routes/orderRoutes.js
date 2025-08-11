const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Token doğrulama middleware

const orderController = require('../controllers/orderController');

// Sipariş işlemleri
router.post('/', protect, orderController.createOrder);
router.get('/my', protect, orderController.getCustomerOrders);
router.put('/:orderId/status', protect, orderController.updateOrderStatus);

// Premium ürün listeleme
router.get('/products/premium', orderController.getPremiumProducts);

// Favorilere ürün ekleme
router.post('/favorites', protect, orderController.addFavorite);

// Satıcıya soru sorma
router.post('/questions', protect, orderController.askQuestion);

// Profil işlemleri
router.get('/profile', protect, orderController.getProfile);
router.put('/profile', protect, orderController.updateProfile);

module.exports = router;
