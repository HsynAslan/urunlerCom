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
  deleteSellerPhoto,
  selectSchema,
  checkSlug,
  fullGetStats,
  contentReview,
  upgradeSellerPlan
} = require('../controllers/sellerController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');


  router.get('/about', protect, allowRoles('seller'), getSellerAbout);
  router.put('/about', protect, allowRoles('seller'), updateSellerAbout);

  router.delete('/photos/:id', protect, allowRoles('seller'), deleteSellerPhoto);
  router.get('/photos', protect, allowRoles('seller'), getSellerPhotos);
  router.post('/photos', protect, allowRoles('seller'), addSellerPhoto);
router.post('/check-slug', checkSlug);

// router.get('/store', protect, allowRoles('seller'), getSellerInfo); 
router.put('/update', protect, allowRoles('seller'), updateSellerInfo);
router.get('/fullstats', protect, allowRoles('seller'), fullGetStats);
router.get('/stats', protect, allowRoles('seller'), getStats);
router.get('/store', protect, allowRoles('seller'), createOrGetSeller);
router.post('/content-review', protect, allowRoles('seller'), contentReview);
router.post('/select-schema', protect, allowRoles('seller'), selectSchema);
router.put('/upgrade-plan', protect, allowRoles('seller'), upgradeSellerPlan);


module.exports = router;
