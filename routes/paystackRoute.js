const express = require('express');
const router = express.Router();
const { initializePayment } = require('../controllers/paystackController');

router.post('/initiate', initializePayment);

module.exports = router;
