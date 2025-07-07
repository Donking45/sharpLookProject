const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/authMiddleware'); // adjust path as needed
const {  vendorRegistration,
  verifyVendorOtp,
  completeVendorProfile,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword} = require('../controllers/vendorController');

// Route to handle vendor registration with file upload (e.g. ID document)
router.post('/register-vendor', vendorRegistration);

// Route to handle additional vendor profile completion
router.post('/vendor/complete-profile', completeVendorProfile);
router.post('/vendor/verify-otp', verifyVendorOtp)
router.post('/vendor/login', login)
router.post('/vendor/forgot-password', forgotPassword);
router.post('/vendor/verify-reset-otp', verifyOTP)
router.patch('/vendor/reset-password', resetPassword);

module.exports = router;
