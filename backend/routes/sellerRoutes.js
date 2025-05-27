const express = require('express');
const router = express.Router();
const {
  // getSellerInfo,   
  updateSellerInfo,
  getStats,
  createOrGetSeller 
} = require('../controllers/sellerController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

// router.get('/store', protect, allowRoles('seller'), getSellerInfo); 
router.put('/update', protect, allowRoles('seller'), updateSellerInfo);
router.get('/stats', protect, allowRoles('seller'), getStats);
router.get('/store', protect, allowRoles('seller'), createOrGetSeller);
module.exports = router;
