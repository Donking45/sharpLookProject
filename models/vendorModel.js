const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['makeup', 'nail', 'hair', 'spa', 'barbering', 'other'], // You can customize
  },
  emailOTP: {
    type: String,
  },
  emailOTPExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


//  Hash password before saving
vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//  Compare entered password with hashed one
vendorSchema.methods.correctPassword = async function (enteredPassword, storedPassword) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = mongoose.model('Vendor', vendorSchema);
