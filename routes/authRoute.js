const express = require('express');
const router = express.Router();
const { 
    bioRegistration,
    authRegistration,
    verifyBioRegister,
    loginWithBio,
    loginWithAuth,
    verifyAuth,
    verifyEmail,
    forgotPassword,
    verifyOTP,
    resetPassword } = require('../controllers/authController');
//const { authorization, validateRegister } = require('../middleware/authMiddleware');


router.get('/bio/register', bioRegistration);
router.post('/auth/register', authRegistration)
router.post('/verify-bio', verifyBioRegister)
router.post('/verify-auth', verifyAuth)
router.get('/bio/login', loginWithBio)
router.post('/auth/login', loginWithAuth);
router.post('/auth/verify-email', verifyEmail)
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/verify-otp', verifyOTP)
router.patch('/auth/reset-password', resetPassword);


module.exports = router;