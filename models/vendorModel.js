const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorProfileSchema = new mongoose.Schema({
  businessName: String,
  businessDescription: String,
  location: String,
  businessRegNumber: String,
  PortfolioLink: String,
})

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
    type: [String],
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
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  vendorProfile: vendorProfileSchema,
 },{ timestamps: true });


vendorSchema.index({ location:
  '2dsphere'
})

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
