const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [String], // örn: ["manage_users", "edit_theme", "view_orders"]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
