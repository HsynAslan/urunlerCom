const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String], // Cloudinary url'leri
    translations: {
      type: Map,
      of: {
        name: String,
        description: String,
      },
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
