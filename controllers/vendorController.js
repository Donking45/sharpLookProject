const { sendEmail} = require('../utils/sendMail')
const Vendor = require('../models/vendorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios')



const vendorRegistration = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { email, password, confirmPassword, serviceType, address } = req.body;

    // Validate required fields
    if (!email || !password || !confirmPassword || !serviceType || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check for existing vendor
    const existingVendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists with this email" });
    }

    const geoResponse = await axios.get('https://api.openCagedata.com/geocode/v1/json', {
      params: {
        q: address,
        key: process.env.OPENCAGE_API_KEY,
      },
    });

    if (!geoResponse.data.results.length) {
      return res.status(400).json({
        message: "Invalid address or no coordinates found"
      })
    }

    const location = geoResponse.data.results[0].geometry;
    const latitude = location.lat;
    const longitude = location.lng

    
    const emailOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Create new vendor
    const newVendor = new Vendor({
      email: email.toLowerCase(),
      password, // Note: Password should be hashed (see recommendations)
      serviceType,
      address,
      emailOTP,
      emailOTPExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      latitude,
      longitude,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });

    await newVendor.save();

    // Send email with OTP
    await sendEmail({
      email: newVendor.email,
      subject: 'Email Verification OTP',
      message: `Your OTP for verification is: ${emailOTP}`,
    });

    res.status(201).json({
      message: 'Vendor registered successfully. OTP sent to email.',
      vendorId: newVendor._id,
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }

};

const resendVendorOTP = async (req, res) =>{
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      })
    }

    const vendor = await Vendor.findOne({ email: email.toLowerCase()})
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found'
      })
    }

    // Generate a new OTP
    const newOTP = Math.floor(1000 + Math.random() * 9000).toString();
    vendor.emailOTP = newOTP;
    vendor.emailOTPExpires = Date.now() + 10 * 60 * 1000;

    await vendor.save({ validateBeforeSave: false})

    await sendEmail({
      email: vendor.email,
      subject: 'Resend Email Verification OTP',
      message: `Your new OTP is: ${newOTP}`
    })

    return res.status(200).json({
      message: 'New OTP sent to your email'
    });
  } catch(error) {
    console.error('Resend OTP error:', error)
    return res.status(500).json({
      message: 'Server error during OTP resend'
    })
  }
}


const verifyVendorOtp = async (req, res) => {
  const { email, otp } = req.body;

  const vendor = await Vendor.findOne({ email });
  if (!vendor) return res.status(404).json({ message: "User not found" });

  if (!vendor.emailOTP || otp.trim() !== vendor.emailOTP.trim() ) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  //if (vendor.emailOTP !== otp) {
    //return res.status(400).json({ message: "Incorrect OTP" });
 // }

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
    const vendorId = req.vendor._id;

    const {
      businessName,
      businessDescription,
      address,
      businessRegNumber,
      portfolioLink,
    } = req.body;

    if (!businessName || !businessDescription || !address || !businessRegNumber || !portfolioLink) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found.' });

    // Geocode the address using OpenCage
    let geoResponse;
    try {
      geoResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: address,
          key: process.env.OPENCAGE_API_KEY,
          limit: 1
        },
        headers: {
          'User-Agent': 'ShapeLookApp/1.0(kingsleyokon610@gmail.com)'
        }
      });
    } catch (Error) {
      console.error('OpenCage API error:', Error.message);
      return res.status(400).json({ message: 'Geocoding service unavailable' });
    }

    console.log('OpenCage API response:', JSON.stringify(geoResponse.data, null, 2));

    if (!geoResponse.data.results || !geoResponse.data.results.length || !geoResponse.data.results[0].geometry) {
      return res.status(400).json({ message: 'Invalid address' });
    }

    const location = geoResponse.data.results[0].geometry;
    const latitude = location.lat;
    const longitude = location.lng

    

    // Set profile and location
    vendor.businessName = businessName;
    vendor.businessDescription = businessDescription;
    vendor.address = address;
    vendor.businessRegNumber = businessRegNumber;
    vendor.portfolioLink = portfolioLink;
    vendor.longitude = longitude;
    vendor.latitude = latitude;

    await vendor.save();

    res.status(200).json({
      message: 'Vendor profile completed successfully',
      vendor,
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

    console.log("Stored OTP:", vendor.otp, "Length:", vendor.otp?.length)
    console.log("Received OTP:", otp, "Length:", otp?.length)

    if (
      !vendor.otp || vendor.otp.trim() !== otp.trim()
    ) {
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

    
    vendor.isOtpVerified = false; // Reset for next time
    vendor.isVerified = true;
    vendor.password = createPassword;
    
    await vendor.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Get All Vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.status(200).json({ vendors });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Single Vendor
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ vendor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Vendor Profile
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor updated successfully', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete Vendor
 const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// find nearest vendor


const findNearestVendors = async (req, res) => {
  try {
    const { latitude, longitude, distance = 3000 } = req.body; // meters

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const vendors = await Vendor.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(distance, 10),
        },
      },
    });

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (err) {
    console.error('Nearest-vendors error:', err.message);
    res.status(500).json({ message: 'Server error while finding nearest vendors.' });
  }
};



module.exports = {
  vendorRegistration,
  verifyVendorOtp,
  completeVendorProfile,
  login,
  forgotPassword,
  resendVendorOTP,
  verifyOTP,
  resetPassword,
  findNearestVendors,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor
};
