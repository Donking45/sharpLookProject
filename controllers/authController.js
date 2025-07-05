const bcrypt = require('bcryptjs');
const { sendEmail, validEmail, sendSMS } = require('../utils/sendMail')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
//const { generateRegistrationOptions } = require('@simplewebauthn/server');
//const  {USERS, getUserByEmail, getUserById, createUser, updateUserCounter} = require("../db")
//const RP_ID = "localhost"



/*const bioRegistration= async (req, res) => {
  try {
    const email = req.query.email;


    if (!email) {
      return res.status(400).json({ message: "Please add your email" });
    }


    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User account already exists" });
    }


    const options = await generateRegistrationOptions({
      rpID: RP_ID,
      rpName: "SharpLook API",
      userName: email,
    });


    res.cookie("regInfo", JSON.stringify({
      email,
      challenge: options.challenge,
    }), { httpOnly: true, maxAge: 60000, secure: true });


    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/

/*const authRegistration = async (req, res) => {
  try {
    const { email, password, confirmPassword, phoneNumber } = req.body
  
    if (!email){
      return res.status(400).json({
        message: "Please add your email"
      })
    }

    if (!validEmail(email)){
      return res.status(400).json({
        message: "Incorrect email format"
      })
    }
  
    if (!password){
      return res.status(400).json({
        message: "Please add your password"
      })
    }
  
    const existingUser = await User.findOne({ email })
  
    if(existingUser){
      return res.status(400).json({
        message: "User account already exist"
      })
    }
  
    if (password.length < 6){
      return res.status(400).json({
        message: "Password should be minimum of 6 chars"
      })
    }
    
  
    const newUser = new User({
      email, 
      password,
      confirmPassword,
      phoneNumber,
  
      
    })
  
    await newUser.save()
  
    
    res.status(201).json({
      message: "User account created successfully",
      newUser: { email, password, confirmPassword, phoneNumber }
    })
  
  } catch (error) {
      res.status(500).json({
        message: error.message
      })
  }
}*/

const authRegistration = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword ) {
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


    const newUser = new User({
      email,
      password,
      otp,
      isVerified: false,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000)
    });

    await newUser.save();

    // Generate OTPs
    const emailOTP = Math.floor(1000 + Math.random() * 9000).toString();
    const phoneOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Send Email OTP
    await sendEmail({
      email,
      subject: "Email Verification OTP",
      message: `Your email OTP is: ${emailOTP}`,
    });

    // Send SMS OTP (mock for now)
    console.log(`Send SMS to ${phoneNumber}: Your phone OTP is ${phoneOTP}`);
     await sendSMS(phoneNumber, `Your phone OTP is: ${phoneOTP}`);

    res.status(201).json({
      message: "User registered. OTPs sent to email and phone (for info only).",
      userId: newUser._id,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

const verifyUserOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  if (user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Account verified successfully" });
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.isVerified) return res.status(401).json({ message: "Please verify your account first" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(200).json({ message: "Login successful", token });
};


/*const verifyBioRegister =  async (req, res) => {
  try {
    const regInfo = JSON.parse(req.cookies.regInfo)

    if(!regInfo) {
      return res.status(400).json({
        error: "Registration info not found"
      })
    }

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: regInfo.challenge,
      expectedOrigin: CLIENT_URL,
      expectedRPID: RP_ID
    })

    if (verification.verified) {
      await createUser(regInfo.userId, regInfo.email, {
        id: verification.registrationInfo.credentialID,
        publicKey: verification.registrationInfo.credentialPublicKey,
        counter: verification.registrationInfo.counter,
        deviceType: verification.registrationInfo.credentialDeviceType,
        backedUp: verification.registrationInfo.credentialBackedUp,
        transport: req.body.transports
      })

    
      res.clearCookie("regInfo")
      return res.json({
        verified: true
      })
    } else {
      return res.status(400).json({
        verified: false,
        error: "verification failed"
      })
    } 
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const loginWithBio = async (req, res) => {
  try {
    const email = req.query.email;


    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }


    const user = getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "No user for this email" });
    }


    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: [
        {
          id: user.passKey.id,
          type: "public-key",
          transports: user.passKey.transports,
        },
      ],
    });


    res.cookie("authInfo", JSON.stringify({
      userId: user.id,
      challenge: options.challenge,
    }), { httpOnly: true, maxAge: 60000, secure: true });


    res.json(options);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login not successful" });
  }
};*/


/*const loginWithAuth =  async (req, res) => {
  try{
    const { email, password } = req.body
     
    if(!email || !password) {
      return res.status(400).json({
        message:'Email and password are required'
      })
    }

    const user = await User.findOne({ email:req.body.email.toLowerCase() }).select('+password');
    
       if(!user || !user.password){
        return res.status(404).json({
          message: "User account does not exist."
        })
       }
       console.log("Entered password:", password);
       console.log("Stored hash:", user.password)

       console.log('User verification status:', user.isVerified)

       if(!user.isVerified) {
        //Generate and send OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false});

        await sendEmail({
          email: user.email,
          subject:'Email Verification OTP',
          message: `Your OTP for email verification is: ${otp}`,
        })
        return res.status(401).json({
          message: 'Your email is not verified. An OTP has been sent to your email'
        });
       }

       if(!user) {
        return res.status(403).json({
          message: 'Access denied. Not a user'
        })
       }
    
       const isMatch = await bcrypt.compare(password, user.password)
    
       if(!isMatch){
        return res.status(400).json({
          message: "Incorrect email or password."
        })
       }

    
       // Generate a token
       const accessToken = jwt.sign(
        {id: user?._id, role: user.role},
        process.env.ACCESS_TOKEN,
        {expiresIn: "5h"}
    )
       
    const refreshToken = jwt.sign(
        {id: user?._id, role: user.role},
        process.env.REFRESH_TOKEN,
        {expiresIn: "14d"}
    )
    
    res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          role: user.role
        }
    })
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({
      message:"Server error during login",
      error: error.message,
    });
  }   
};
*/


      /*  
        const verifyAuth = async (req, res) => {
          try {
            const authInfo = JSON.parse(req.cookies.authInfo);
        
        
            if (!authInfo) {
              return res.status(400).json({ error: "Authentication info not found" });
            }
        
        
            const user = getUserById(authInfo.userId);
            if (!user) {
              return res.status(404).json({ error: "User not found" });
            }
        
        
            const verification = await verifyAuthenticationResponse({
              response: req.body,
              expectedChallenge: authInfo.challenge,
              expectedOrigin: CLIENT_URL,
              expectedRPID: RP_ID,
              authenticator: {
                credentialID: user.passKey.id,
                credentialPublicKey: user.passKey.publicKey,
                counter: user.passKey.counter,
                transports: user.passKey.transports,
              },
            });
        
        
            if (verification.verified) {
              updateUserCounter(authInfo.userId, verification.authenticationInfo.newCounter);
              res.clearCookie("authInfo");
              return res.json({ verified: true });
            } else {
              return res.status(400).json({ verified: false, error: "Verification failed" });
            }
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        };
        */

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
};


const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if(!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required'
      })
    }


    const user = await User.findOne({ email:email.toLowerCase()});


    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }


    // Check if OTP is invalid or expired
    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }


    // If user not verified yet → this is email verification
    if (!user.isOtpVerified) {
      user.isOtpVerified = true;
    }


    // Whether for email verification or password reset, clear OTP after success
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;
    await user.save();



    return res.status(200).json({ message: 'OTP verified successfully' });


  } catch (error) {
    console.error('verifyOTP error:', error);
    return next(error);
  }
};
*/


const resetPassword = async (req, res, next) => {
  try{
    const {newPassword, confirmPassword } = req.body
    

  if(!newPassword || !confirmPassword){
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (newPassword !== confirmPassword){
    return res.status(400).json({
      message: 'Passwords do not match'
    })
  }
  

  const user = await User.findOne({email:email.toLowerCase()})

  if (!user){
    return res.status(404).json({
      message:'User not found'
    })
  }

  if(!user.isOtpVerified) {
    return res.status(400).json({ message:"Please verify OTP before resetting password"})
  }

  
  user.password = newPassword;
  user.isOtpVerified = false
  user.isVerified = true
  await user.save();

  
  return res.status(200).json({
    status: 'Password reset successful'
  })

   } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message:"Server error during password reset",
      error: error.message,
    });
  }   
}
  
  

module.exports = {
  //bioRegistration,
  authRegistration,
  verifyUserOtp,
  loginUser,
  //verifyBioRegister,
  //loginWithBio,
  //loginWithAuth,
  //verifyAuth,
  forgotPassword,
  //verifyEmail,
  //verifyOTP,
  resetPassword,
}
    
