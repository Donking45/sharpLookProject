const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paymentType: { type: String, enum: ['booking', 'subscription', 'wallet'], default: 'booking' },
  metadata: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
