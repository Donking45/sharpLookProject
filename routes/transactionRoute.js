const {getTransactions, createTransaction} = require('../controllers/transactionController');
const express = require('express');
const router = express.Router();



router.post('/create', createTransaction)

// Get Transaction History
router.get('/transactions/:userId', getTransactions)
  

module.exports = router;
  