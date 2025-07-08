const { sendEmail} = require('../utils/sendMail')
const Vendor = require('../models/vendorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const vendorRegistration = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { email, password, confirmPassword, serviceType } = req.body;

    if (!email || !password || !confirmPassword || !serviceType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingVendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists with this email" });
    }


    const emailOTP = Math.floor(1000 + Math.random() * 9000).toString();

    const newVendor = new Vendor({
      email: email.toLowerCase(),
      password,
      serviceType,
      emailOTP,
      emailOTPExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await newVendor.save();

    await sendEmail({
      email: newVendor.email,
      subject: "Email Verification OTP",
      message: `Your OTP for verification is: ${emailOTP}`,
    });

    res.status(201).json({
      message: "Vendor registered successfully. OTP sent to email.",
      vendorId: newVendor._id,
    });
  } catch (error) {
    console.error("Vendor registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};


const verifyVendorOtp = async (req, res) => {
  const { email, otp } = req.body;

  const vendor = await Vendor.findOne({ email });
  if (!vendor) return res.status(404).json({ message: "User not found" });

  if (vendor.emailOTP !== otp) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  if (vendor.emailOTPExpires < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  vendor.isVerified = true;
  vendor.emailOTP = undefined;
  vendor.emailOTPExpires = undefined;

  await vendor.save();

  res.status(200).json({ message: "Account verified successfully" });
};

const completeVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendor.id; // You need to use JWT auth middleware to set req.user
    const {
      businessName,
      businessDescription,
      location,
      businessRegNumber,
      portfolioLink
    } = req.body;

    // Validate fields
    if (!businessName || !businessDescription || !location || !businessRegNumber || !portfolioLink) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Fetch vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    if (!vendor.isVerified) {
      return res.status(403).json({ message: 'Email verification required before completing profile.' });
    }

    // Update profile
    vendor.businessName = businessName;
    vendor.businessDescription = businessDescription;
    vendor.location = location;
    vendor.businessRegNumber = businessRegNumber;
    vendor.portfolioLink = portfolioLink;

    await vendor.save();

    res.status(200).json({
      message: 'Vendor profile completed successfully.',
      vendorProfile: {
        businessName: vendor.businessName,
        businessDescription: vendor.businessDescription,
        location: vendor.location,
        businessRegNumber: vendor.businessRegNumber,
        portfolioLink: vendor.portfolioLink,
      },
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });

    }

    const vendor = await Vendor.findOne({ email: email.toLowerCase() }).select('+password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor account does not exist.' });
    }


    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password.' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: vendor._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: '5h' }
    );

    const refreshToken = jwt.sign(
      { id: vendor._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: '14d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      vendor: {
        id: vendor._id,
        email: vendor.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
};

const forgotPassword = async (req, res, next) => {

  try{
    const { email } = req.body

    if(!email) {
      res.status(400).json({
        message: 'Email is required'
      })
    }

    const vendor = await Vendor.findOne({email:email.toLowerCase()})

    if(!vendor){
       return next(new ErrorResponse('User not found',404))
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    vendor.otp = otp;
    vendor.otpExpires = Date.now() + 10 * 60 * 1000
    //admin.otpVerifiedForReset = false;


    await vendor.save({validateBeforeSave: false})

    console.log("OTP:", otp)
    console.log("Email will be sent to:", email)

    const message = `Your OTP for password reset is:${otp}`;
  
    await sendEmail({
      email: vendor.email,
      subject: 'Password Reset OTP',
      message: message
    })

    res.status(200).json({ message: "Please check your email"})
  
  } catch(err){
    console.error('Forgot Password error:', err)

    return next(new ErrorResponse('There was an error sending otp. Please try again later', 500));
  }

}


const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
      });
    }

    const vendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    console.log("Stored OTP:", vendor.otp);
    console.log("Received OTP:", otp);

    if (!vendor.otp ||
      String(vendor.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    if (!vendor.otpExpires || vendor.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // OTP is correct and not expired
    vendor.isOtpVerified = true;
    vendor.otp = undefined;
    vendor.otpExpires = undefined;

    await vendor.save();

    return res.status(200).json({ message: 'OTP verified successfully. You can now reset your password.' });
  } catch (error) {
    console.error('verifyOTP error:', error);
    return res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, createPassword, confirmPassword } = req.body;

    if (!email || !createPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (!vendor.isOtpVerified) {
      return res.status(403).json({ message: "OTP verification required before password reset" });
    }

    if (createPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    
    user.isOtpVerified = false; // Reset for next time
    user.isVerified = true;
    user.password = createPassword;
    
    await vendor.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  vendorRegistration,
  verifyVendorOtp,
  completeVendorProfile,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword
};
