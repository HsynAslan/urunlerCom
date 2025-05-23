const express = require('express');
const router = express.Router();
const {
  getSellerStore,
  updateSellerInfo,
  getStats
} = require('../controllers/sellerController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.get('/store', protect, allowRoles('seller'), getSellerStore);
router.put('/update', protect, allowRoles('seller'), updateSellerInfo);
router.get('/stats', protect, allowRoles('seller'), getStats);

module.exports = router;
