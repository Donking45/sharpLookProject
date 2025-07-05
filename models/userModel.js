const mongoose = require('mongoose');
//const Roles = require('../constants/roles');
//const crypto = require('crypto')
const bcrypt = require('bcryptjs');
//const ErrorResponse = require('../utils/errorResponse');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true, select: false},
  phoneNumber: {type: Number},
  passKey: { 
    id: String,
    publicKey: String,
    counter: Number,
    transports: [String]
  },
  preferences: Object,
  paymentMethods: [Object],
  role: { type: String, enum: ['admin', 'user'], required: true},
  emailOTP: { type: String },
  phoneOTP: {type: String },
  emailOTPExpires: {type: Date },
  phoneOTPExpires: {type: Date },
  isSuspended: {type: Boolean, default: false},
  isVerified: {type: Boolean, default: false },
  isOtpVerified: {type: Boolean, default: false },
  isAdmin:{type: Boolean, default: false}
  
}, { timestamps: true });

const updateProfile = async (req, res) => {
  const {id} = req.user;
  try {
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true})
    res.status(200).json({ updated });
  } catch (err) {
    res.status(500).json({message: err.message})
  }
};

/*
userSchema.methods.createResetPasswordToken = function (){
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  console.log(resetToken, this.resetPasswordToken)

  return resetToken;
  
}

userSchema.pre('validate', function(next) {
  if( this.isNew && this.password !== this.confirmPassword) {
    this.invalidate('confirmPassword', 'Passwords do not match')
  }
  next()
})*/

userSchema.virtual('confirmPassword')
  .get(function (){
    return this._confirmPassword
  })
  .set(function (value){
    this._confirmPassword = value
  })


  //Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12)

  next()

});


/*userSchema.methods.createResetCode = function () {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code


  // Store a hashed version
  this.resetCode = crypto.createHash("sha256").update(resetCode).digest("hex");


  this.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry


  return resetCode; // Return unhashed code to send to user
};*/


// password comparison method
userSchema.methods.correctPassword = async function (candidatePassword,
  userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
  };


 /* Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


//  Match user entered password to hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


  Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");


  // Hash token and set to restPasswordToken field
  this.restPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");


  // Set expire time to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;


  return resetToken;
};*/


module.exports = mongoose.model("User", userSchema);











