const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: {
    type: String,
    enum: ['debit', 'credit'],
     required: true
  },
  amount: { type: Number, required: true },
  description: { type: String},
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
