const express = require('express');
const router = express.Router();
const {
  // getSellerInfo,   
  updateSellerInfo,
  getStats,
  createOrGetSeller,
   getSellerAbout,
  updateSellerAbout,
  getSellerPhotos,
  addSellerPhoto,
  deleteSellerPhoto
} = require('../controllers/sellerController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');


  router.get('/about', protect, allowRoles('seller'), getSellerAbout);
  router.put('/about', protect, allowRoles('seller'), updateSellerAbout);

  router.delete('/photos/:id', protect, allowRoles('seller'), deleteSellerPhoto);
  router.get('/photos', protect, allowRoles('seller'), getSellerPhotos);
  router.post('/photos', protect, allowRoles('seller'), addSellerPhoto);

// router.get('/store', protect, allowRoles('seller'), getSellerInfo); 
router.put('/update', protect, allowRoles('seller'), updateSellerInfo);
router.get('/stats', protect, allowRoles('seller'), getStats);
router.get('/store', protect, allowRoles('seller'), createOrGetSeller);

module.exports = router;
