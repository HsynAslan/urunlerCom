const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getSingleProduct,
  getMyProducts
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

// Satıcının kendi ürünlerini listelemek için route, auth zorunlu
router.get('/', protect, allowRoles('seller'), getSellerProducts);
router.get('/mine', protect, allowRoles('seller'), getMyProducts);
router.get('/:id', getSingleProduct);
router.post('/', protect, allowRoles('seller'), createProduct);
router.put('/:id', protect, allowRoles('seller'), updateProduct);
router.delete('/:id', protect, allowRoles('seller'), deleteProduct);

module.exports = router;
