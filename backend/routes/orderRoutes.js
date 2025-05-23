const express = require('express');
const router = express.Router();
const {
  createOrder,
  getSellerOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/', createOrder);
router.get('/my', protect, allowRoles('seller'), getSellerOrders);
router.put('/:orderId/status', protect, allowRoles('seller'), updateOrderStatus);

module.exports = router;
