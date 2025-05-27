const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Urunlerim.com' },
  backgroundImage: { type: String },
  apiUrl: { type: String, default: 'http://localhost:5000/api' }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
