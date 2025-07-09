const express = require('express');
const router = express.Router();
const { 
    authRegistration,
    verifyUserOtp,
    resendOTP,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword } = require('../controllers/authController');
//const { authorization, validateRegister } = require('../middleware/authMiddleware');


//router.get('/bio/register', bioRegistration);
router.post('/auth/register', (req, res) => {
    console.log("Incoming request body:")
    return  authRegistration(req, res)
})

router.post('/auth/verify-otp', verifyUserOtp)
router.post('/auth/resnd-otp', resendOTP)
router.post('/auth/login', login)
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/verify-reset-otp', verifyOTP)
router.patch('/auth/reset-password', resetPassword);
//router.Patch('/profile', updateProfile)

module.exports = router;