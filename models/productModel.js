const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  image: {
    public_id: {
      type: Object,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  category: {
    type: String,
    enum: ['makeup', 'hair', 'nail', 'barbering', 'spa', 'others'],
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
