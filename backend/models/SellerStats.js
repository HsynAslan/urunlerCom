const mongoose = require('mongoose');

const sellerStatsSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    date: { type: Date, required: true }, // İstatistiğin ait olduğu gün (sadece tarih kısmı kullanılır)
    
    totalVisits: { type: Number, default: 0 },
    phoneClicks: { type: Number, default: 0 },
    locationClicks: { type: Number, default: 0 },
    qrDownloads: { type: Number, default: 0 },
    ordersPlaced: { type: Number, default: 0 },
    averageDuration: { type: Number, default: 0 }, // Saniye cinsinden ortalama sayfada kalma süresi

    // İstersen daha sonra detaylı ziyaret kayıtları da ekleyebilirsin:
    // detailedVisits: [{ ... }]
  },
  { timestamps: true }
);

// Günlük bazda tek kayıt olması için compound index
sellerStatsSchema.index({ seller: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('SellerStats', sellerStatsSchema);
