const express = require('express');
const router = express.Router();
const {
  getAllSellers,
  updateSellerPlan,
  deleteUser
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.get('/sellers', protect, allowRoles('admin'), getAllSellers);
router.put('/seller/:sellerId/plan', protect, allowRoles('admin'), updateSellerPlan);
router.delete('/user/:userId', protect, allowRoles('admin'), deleteUser);

module.exports = router;
