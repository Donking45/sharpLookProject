const express = require('express');
const router = express.Router();
const { 
    authRegistration,
    verifyUserOtp,
    loginUser,
    //verifyBioRegister,
    //loginWithBio,
    //loginWithAuth,
    //verifyAuth,
    //verifyEmail,
    forgotPassword,
    //verifyOTP,
    resetPassword } = require('../controllers/authController');
//const { authorization, validateRegister } = require('../middleware/authMiddleware');


//router.get('/bio/register', bioRegistration);
router.post('/auth/register', (req, res) => {
    console.log("Incoming request body:")
    return  authRegistration(req, res)
})

router.post('/auth/verify-otp', verifyUserOtp)
router.post('/auth/login', loginUser)
//router.post('/verify-bio', verifyBioRegister)
//router.post('/verify-auth', verifyAuth)
//router.get('/bio/login', loginWithBio)
//router.post('/auth/login', loginWithAuth);
//router.post('/auth/verify-email', verifyEmail)
router.post('/auth/forgot-password', forgotPassword);
//router.post('/auth/verify-otp', verifyOTP)
router.patch('/auth/reset-password', resetPassword);
//router.Patch('/profile', updateProfile)

module.exports = router;