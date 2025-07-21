const express = require('express');
const router = express.Router();
const {authorization} = require('../middlewares/authMiddleware');
const  upload  = require('../middlewares/multer'); // adjust path as needed
const {  vendorRegistration,
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
  deleteVendor,
} = require('../controllers/vendorController');


// Route to handle vendor registration with file upload (e.g. ID document)
router.post('/register-vendor',  vendorRegistration);

// Route to handle additional vendor profile completion
router.post('/vendor/complete-profile', authorization,  completeVendorProfile);
router.post('/vendor/resend-otp', resendVendorOTP)
router.post('/vendor/verify-otp', verifyVendorOtp)
router.post('/vendor/login', login)
router.post('/vendor/forgot-password', forgotPassword);
router.post('/vendor/verify-reset-otp', verifyOTP)
router.patch('/vendor/reset-password', resetPassword);
router.post('/find-nearest-vendor', findNearestVendors)
router.get('/vendor', getAllVendors)
router.get('/:id', getVendorById)
router.put('/:id', updateVendor)
router.delete('/:id', deleteVendor)

module.exports = router;
