const express = require('express');
const router = express.Router();
const {
  vendorRegister,
  uploadDocs,
  setAvailability,
  setServiceArea,
  getVendorProfile
} = require('../controllers/vendorController');

router.post('/vendor/register', vendorRegister);
router.post('/vendor/upload', uploadDocs);
router.post('/vendor/availability', setAvailability);
router.post('/vendor/service-area', setServiceArea);
router.get('/vendor/profile/:id', getVendorProfile);

module.exports = router;
