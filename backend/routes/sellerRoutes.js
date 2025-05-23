const express = require('express');
const router = express.Router();
const {
  getSellerInfo,    // burayı değiştiriyoruz
  updateSellerInfo,
  getStats
} = require('../controllers/sellerController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.get('/store', protect, allowRoles('seller'), getSellerInfo); // burası da güncel isimle uyumlu
router.put('/update', protect, allowRoles('seller'), updateSellerInfo);
router.get('/stats', protect, allowRoles('seller'), getStats);

module.exports = router;
