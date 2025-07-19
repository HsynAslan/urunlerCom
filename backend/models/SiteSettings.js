const mongoose = require('mongoose');

const apiEndpointSchema = new mongoose.Schema({
  name: String,             // Örnek: "Get My Products"
  path: String,             // Örnek: "/api/products/mine"
  method: String,           // Örnek: "GET", "POST"
  description: String       // Açıklama metni
}, { _id: false });

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Urunlerim.com' },
  backgroundImage: { type: String },
  frontendUrl: { type: String, default: 'http://localhost:3002' },
  apiUrl: { type: String, default: 'http://localhost:5000/api' },

  mailSettings: {
    email: { type: String },
    password: { type: String }
  },

  defaultLanguage: { type: String, default: 'tr' },
  maintenanceMode: { type: Boolean, default: false },

  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },

  contactPhone: { type: String },
  contactAddress: { type: String },

  apiEndpoints: [apiEndpointSchema]
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
