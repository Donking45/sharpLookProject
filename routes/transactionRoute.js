const {getTransactions} = require('../controllers/transactionController');
const express = require('express');
const router = express.Router();

// Get Transaction History
router.get('/transactions/:userId', getTransactions)
  
  module.exports = router;
  