const mongoose = require('mongoose');

const descriptionSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },        // Açıklama başlığı
  items: [{ type: String }]                        // Liste maddeleri
});

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    priceCurrency: { type: String, enum: ['TRY', 'USD', 'EUR'], default: 'TRY' }, // Para birimi

    stock: { type: Number, default: 0 },
    stockUnit: { type: String, enum: ['adet', 'ml', 'g', 'kg'], default: 'adet' }, // Stok birimi

    images: [String], // Cloudinary veya başka depolama URL’leri
    showcaseImageIndex: { type: Number, default: 0 }, // Vitrin fotoğrafı indeksi

    translations: {
      type: Map,
      of: {
        name: String,
        descriptionSections: [descriptionSectionSchema]  // Çoklu açıklama bölümleri
      }
    },

    descriptionSections: [descriptionSectionSchema], // Çoklu açıklama bölümleri (ana dil için)

    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
