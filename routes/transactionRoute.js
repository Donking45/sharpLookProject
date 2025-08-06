const {getTransactions, createTransaction} = require('../controllers/transactionController');
const express = require('express');
const router = express.Router();



router.post('/create/transaction', createTransaction)

// Get Transaction History
router.get('/transactions/:userId', getTransactions)
  

module.exports = router;
  