const express = require('express');
const router = express.Router();
const {
  createBookings,
  getClientBookings,
  getVendorBookings
} = require('../controllers/bookingController');

const { authorization } = require('../middlewares/authMiddleware');

// Create booking
router.post('/booking/create', authorization, createBookings);

// Get client bookings
router.get('/booking/client', authorization, getClientBookings);

// Get vendor bookings
router.get('/booking/vendor',  getVendorBookings);

module.exports = router;
