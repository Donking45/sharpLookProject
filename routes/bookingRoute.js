const express = require('express')
const router = express.Router();
const { createBooking, getBookHistory }= require('../controllers/bookingController');


router.post('/create', createBooking)
router.get('/history', getBookHistory)

module.exports = router