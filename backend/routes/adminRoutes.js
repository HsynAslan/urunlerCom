const express = require('express');
const router = express.Router();

const {
  loginAdmin,
  createSubAdmin,
  getAdminSettings,
  updateAdminSettings,
  getMe 
} = require('../controllers/adminController');

const { adminProtect, allowAdminRoles } = require('../middlewares/adminAuthMiddleware');

router.get('/me', adminProtect, getMe);

// Auth
router.post('/login', loginAdmin);

// Sub Admin (Sadece 'manage_admins' yetkisi olanlar)
router.post('/subadmin', adminProtect, allowAdminRoles('manage_admins'), createSubAdmin);


// Site Ayarları (Sadece 'edit_site_settings' yetkisi olanlar)
router.get('/settings', adminProtect, allowAdminRoles(['edit_site_settings']), getAdminSettings);
router.put('/settings', adminProtect, allowAdminRoles(['edit_site_settings']), updateAdminSettings);

module.exports = router;
