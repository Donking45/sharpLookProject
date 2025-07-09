const mongoose = require('mongoose');


const offerSchema = new mongoose.Schema({
    title: String,
    description: String,
    discount: Number, // e.g., 10 or 60
    serviceType: String,
    expiresAt: Date,
  });
  
  module.exports = mongoose.model('Offer', offerSchema);
  