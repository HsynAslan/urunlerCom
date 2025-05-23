const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    contactInfo: {
      phone: String,
      email: String,
      address: String,
      website: String,
    },
    theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' },
    plan: {
      type: String,
      enum: ['free', 'premium', 'business'],
      default: 'free',
    },
    languages: [String], // örn: ['tr', 'en']
  },
  { timestamps: true }
);

module.exports = mongoose.model('Seller', sellerSchema);
