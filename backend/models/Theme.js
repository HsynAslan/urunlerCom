const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cssFileUrl: { type: String, required: true },  // Cloudinary veya public path
    previewImageUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theme', themeSchema);
