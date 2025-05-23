const express = require('express');
const router = express.Router();
const {
  getAllThemes,
  uploadTheme,
  deleteTheme
} = require('../controllers/themeController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.get('/', getAllThemes);
router.post('/', protect, allowRoles('admin'), uploadTheme);
router.delete('/:id', protect, allowRoles('admin'), deleteTheme);

module.exports = router;
