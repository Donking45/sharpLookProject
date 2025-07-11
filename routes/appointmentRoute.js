const express = require('express');
const router = express.Router();
const {bookAppointment, verifyPayment, getAllAppointment } = require('./controllers/appointmentController')




// Book an appointment and initialize payment
router.post('/book-Appointment', bookAppointment )

// Verify payment
router.get('/verify-payment', verifyPayment)

// Get all appointments
router.get('/get-all-appointment', getAllAppointment)

module.exports = router;
