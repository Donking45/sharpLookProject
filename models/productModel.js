const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  isRecommended: { type: Boolean, default: false },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
