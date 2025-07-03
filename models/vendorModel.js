const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  bio: String,
  category: String, // e.g. makeup, nails, hair
  location: String,
  documents: {
    idCard: String,
    certificate: String
  },
  portfolio: [String], // array of image URLs
  availability: {
    workDays: [String],
    startTime: String,
    endTime: String
  },
  serviceArea: {
    radius: Number,
    unit: String,
    location: String
  },
  status: {
    type: String,
    enum: ['pending_verification', 'active', 'banned'],
    default: 'pending_verification'
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
