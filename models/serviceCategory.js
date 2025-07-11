const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
