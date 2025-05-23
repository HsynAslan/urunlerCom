const express = require('express');
const router = express.Router();
const { sendTestMail } = require('../controllers/mailController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/send', protect, allowRoles('admin'), sendTestMail);

module.exports = router;
