const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String }, // required değil
    slug: { type: String, unique: true, sparse: true}, // sparse: sadece slug varsa kontrol eder
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
    languages: [String],
  },
  { timestamps: true }
);


module.exports = mongoose.model('Seller', sellerSchema);
