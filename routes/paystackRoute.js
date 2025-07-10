const express = require('express');
const router = express.Router();
const { initializePayment } = require('../controllers/paystackController');

router.post('/paystack/initiatePayment', initializePayment);

module.exports = router;
