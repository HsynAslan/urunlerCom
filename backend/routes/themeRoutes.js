const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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
router.get('/files', (req, res) => {
  const themesDir = path.join(__dirname, '..', 'public', 'themes');

  fs.readdir(themesDir, (err, files) => {
    if (err) {
      console.error('Tema dosyaları okunamadı:', err);
      return res.status(500).json({ message: 'Temalar okunamadı.' });
    }
    // Yalnızca .css uzantılı dosyalar
    const cssFiles = files.filter(file => file.endsWith('.css'));
    res.json(cssFiles);
  });
});

module.exports = router;
