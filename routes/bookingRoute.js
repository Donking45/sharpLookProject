const express = require('express');
const router = express.Router();
const {
  createBookings,
  getClientBookings,
  getVendorBookings
} = require('../controllers/bookingController');

const { authorization } = require('../middlewares/authMiddleware');

// Create booking
router.post('/create', authorization, createBookings);

// Get client bookings
router.get('/client', authorization, getClientBookings);

// Get vendor bookings
router.get('/vendor',  getVendorBookings);

module.exports = router;
