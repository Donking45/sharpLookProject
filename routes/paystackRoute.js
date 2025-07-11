// routes/productRoute.js
const express = require('express');
const router = express.Router();
const { initiateProductPayment } = require('../controllers/paystackController');
const { authorization} = require('../middlewares/authMiddleware');



router.post('/pay', authorization,  initiateProductPayment);

module.exports = router;
