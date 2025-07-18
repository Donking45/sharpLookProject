const bcrypt = require('bcryptjs');
const { sendEmail, validEmail } = require('../utils/sendMail')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const authRegistration = async (req, res) => {
  
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
   
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validEmail(email)) {
      return res.status(400).json({ message: "Incorrect email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be minimum of 6 characters" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User account already exists" });
    }
    // Generate OTP
    const emailOTP = Math.floor(1000 + Math.random() * 9000).toString();
 
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      emailOTP,
      emailOTPExpires: Date.now() + 10 * 60 * 1000,
    });
    await newUser.save();
   
    // Send Email OTP
    await sendEmail({
      email,
      subject: "Email Verification OTP",
      message: `Your email OTP is: ${emailOTP}`,
    });
   
    res.status(201).json({
      message: "User registered. OTP sent to email.",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};


const resendOTP = async (req, res) =>{
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      })
    }

    const user = await User.findOne({ email: email.toLowerCase()})
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Generate a new OTP
    const newOTP = Math.floor(1000 + Math.random() * 9000).toString();
    user.emailOTP = newOTP;
    user.emailOTPExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false})

    await sendEmail({
      email: user.email,
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

const verifyUserOtp = async (req, res) => {
  try{
    const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: 'Email and OTP are required'
    })
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.emailOTP || otp.trim() !== user.emailOTP.trim() ) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  if (!user.emailOTPExpires || user.emailOTPExpires < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.isVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpires = undefined;

  await user.save();

  res.status(200).json({
     message: "Account verified successfully" });
  } catch(error) {
    console.error('Email verification error:', error)
    return res.status(500).json({
      message: 'Server error during email verification'
    })
  }
}; 
  



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User account does not exist.' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password.' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: '5h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: '14d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email
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

    const user = await User.findOne({email:email.toLowerCase()})

    if(!user){
       return next(new ErrorResponse('User not found',404))
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000
    //admin.otpVerifiedForReset = false;


    await user.save({validateBeforeSave: false})

    console.log("OTP:", otp)
    console.log("Email will be sent to:", email)

    const message = `Your OTP for password reset is:${otp}`;
  
    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      message: message
    })

    res.status(200).json({ message: "Please check your email"})
  
  } catch(err){
    console.error('Forgot Password error:', err)

    return next(new ErrorResponse('There was an error sending otp. Please try again later', 500));
  }

}

/*const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if(!email || !otp){
      return res.status(400).json({
        message: 'Email and otp are required.'
      })
    }

    const user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }


    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }


    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();


    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error('Email verification error:', error);
    return  res.status(500).json({
      message: 'Server error during email verification.'
    })
  }
};*/

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      !user.otp ||
      String(user.otp).trim() !== String(otp).trim()
    ) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // OTP is correct and not expired
    user.isOtpVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    

    await user.save();

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

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isOtpVerified) {
      return res.status(403).json({ message: "OTP verification required before password reset" });
    }

    if (createPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    
    user.isOtpVerified = false; // Reset for next time
    user.isVerified = true;
    user.password = createPassword;
    
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  authRegistration,
  verifyUserOtp,
  resendOTP,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
}
    
