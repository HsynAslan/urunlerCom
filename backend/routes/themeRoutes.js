const express = require('express');
const router = express.Router();
const {
  getAllThemes,
  uploadTheme,
  deleteTheme
} = require('../controllers/themeController');
const { adminProtect, allowAdminRoles } = require('../middlewares/adminAuthMiddleware');

// Public: temaları listele
router.get('/', getAllThemes);

// Admin korumalı ve yetkili route'lar
router.post('/', adminProtect, allowAdminRoles('edit_theme'), uploadTheme);
router.delete('/:id', adminProtect, allowAdminRoles('edit_theme'), deleteTheme);


module.exports = router;
