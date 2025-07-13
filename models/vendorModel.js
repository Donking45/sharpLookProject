const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const geocode = require('../utils/geocoder')

const vendorSchema = new mongoose.Schema({
  rating:{
    type: Number,
    default: 0
  },
  profileImage:{
    type:String
  },
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
  otp: {type: String },
  otpExpires: {type: Date},
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
  isOtpVerified: {type: Boolean, default: false },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    businessName: String,
    businessDescription: String,
    location: String,
    businessRegNumber: String,
    PortfolioLink: String,
    formattedAddress: String
  }
}, { timestamps: true });

// Geocode & create location

vendorSchema.pre('save', async function (next) {
  if (!this.address) return next(); // Skip if no address

  try {
    const geoData = await geocode({
      q: this.address,
      key: process.env.OPENCAGE_API_KEY,
      language: 'en'
    });

    const loc = geoData.results[0];
    this.location = {
      type: 'Point',
      coordinates: [lng, lat],
      formattedAddress: formatted || 'Unknown',
    };
    
    // optionally keep or remove address
    // this.address = undefined;

    next();
  } catch (err) {
    console.error('Geocode error:', err);
    next(err);
  }
});


const updateProfile = async (req, res) => {
  const {id} = req.vendor;
  try {
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true})
    res.status(200).json({ updated });
  } catch (err) {
    res.status(500).json({message: err.message})
  }
};

vendorSchema.virtual('confirmPassword')
  .get(function (){
    return this._confirmPassword
  })
  .set(function (value){
    this._confirmPassword = value
  })



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
