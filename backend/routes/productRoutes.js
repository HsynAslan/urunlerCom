const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getSingleProduct
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.get('/', getSellerProducts);
router.get('/:id', getSingleProduct);
router.post('/', protect, allowRoles('seller'), createProduct);
router.put('/:id', protect, allowRoles('seller'), updateProduct);
router.delete('/:id', protect, allowRoles('seller'), deleteProduct);

module.exports = router;
