const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Örn: "admin"
  password: { type: String, required: true },                // Hashlenmiş
  roles: [{ type: String }]                                  // Örn: ['manage_users', 'edit_theme']
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
