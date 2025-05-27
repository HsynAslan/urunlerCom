const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  createSubAdmin,
  getAdminSettings,
  updateAdminSettings
} = require('../controllers/adminController');
const { adminProtect, allowAdminRoles } = require('../middlewares/adminAuthMiddleware');

// Auth
router.post('/login', loginAdmin);

// Sub Admin
router.post('/subadmin', adminProtect, allowAdminRoles('manage_admins'), createSubAdmin);

// Site Ayarları
router.get('/settings', adminProtect, allowAdminRoles('edit_site_settings'), getAdminSettings);
router.put('/settings', adminProtect, allowAdminRoles('edit_site_settings'), updateAdminSettings);

module.exports = router;
