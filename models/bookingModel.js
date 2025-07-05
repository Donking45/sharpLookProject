const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    vendor: {type: mongoose.Schema.Types.ObjectId, ref:'Vendor'},
    serviceType: String,
    scheduledTime: Date,
    status: { type: String, enum: ['pending','confirmed', 'completed', 'cancelled'], default: 'pending'},
    isInstant: Boolean,
    location: String,
    price: Number,
})

module.exports = mongoose.model('Booking', bookingSchema)