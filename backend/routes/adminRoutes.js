const express = require('express');
const router = express.Router();

const {
  loginAdmin,
  createSubAdmin,
  getAdminSettings,
  updateAdminSettings,
  getMe,
  searchUsers,
  getUserProducts,
  updateProduct
} = require('../controllers/adminController');

const { adminProtect, allowAdminRoles } = require('../middlewares/adminAuthMiddleware');

router.get('/me', adminProtect, getMe);

// Auth
router.post('/login', loginAdmin);

// Sub Admin (Sadece 'manage_admins' yetkisi olanlar)
router.post('/subadmin', adminProtect, allowAdminRoles('manage_admins'), createSubAdmin);


router.get('/users/:userId/products', adminProtect, allowAdminRoles('manage_users'), getUserProducts);
// Site Ayarları (Sadece 'edit_site_settings' yetkisi olanlar)
router.get('/settings', adminProtect, allowAdminRoles('edit_site_settings'), getAdminSettings);
router.put('/settings', adminProtect, allowAdminRoles('edit_site_settings'), updateAdminSettings);
router.get('/users', adminProtect, allowAdminRoles('manage_users'), searchUsers);

router.patch('/products/:id', adminProtect, allowAdminRoles('manage_products'), updateProduct);


module.exports = router;
