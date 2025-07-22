const express = require('express');
const router = express.Router();
const {
  createBookings,
  getClientBookings,
  getVendorBookings
} = require('../controllers/bookingController');

const { authorization } = require('../middlewares/authMiddleware');

// Create booking
router.post('/bookings/create', authorization, createBookings);

// Get client bookings
router.get('/bookings/client', authorization, getClientBookings);

// Get vendor bookings
router.get('/bookings/vendor',  getVendorBookings);

module.exports = router;
