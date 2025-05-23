const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    quantity: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
