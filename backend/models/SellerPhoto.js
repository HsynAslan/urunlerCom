const mongoose = require('mongoose');

const sellerPhotoSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    imageUrl: { type: String, required: true },
    caption: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellerPhoto', sellerPhotoSchema);
