// routes/productRoute.js
const express = require('express');
const router = express.Router();
const { initiatePayment } = require('../controllers/paystackController');
//const { authorization} = require('../middlewares/authMiddleware');



router.post('/paystack',  initiatePayment);

module.exports = router;
