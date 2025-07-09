const express = require('express');
const router = express.Router();
const  upload  = require('../middlewares/multer'); // adjust path as needed
const {  vendorRegistration,
  verifyVendorOtp,
  completeVendorProfile,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  find_vendor, 
  getVendors,
  addVendors} = require('../controllers/vendorController');
  const { authorization } = require('../middlewares/authMiddleware')

// Route to handle vendor registration with file upload (e.g. ID document)
router.post('/register-vendor',  vendorRegistration);

// Route to handle additional vendor profile completion
router.get('/vendor/:vendorId/complete-profile',  completeVendorProfile);
router.post('/vendor/verify-otp', verifyVendorOtp)
router.post('/vendor/login', login)
router.post('/vendor/forgot-password', forgotPassword);
router.post('/vendor/verify-reset-otp', verifyOTP)
router.patch('/vendor/reset-password', resetPassword);
router.get('/vendor/getVendors', getVendors);
router.post('/vendor/addVendors', addVendors);
router.post('/find-nearest-vendor', find_vendor)

module.exports = router;
