const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  reference: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paymentType: { type: String, enum: ['booking', 'subscription', 'wallet'], default: 'booking' },
  metadata: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
