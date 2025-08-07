const express = require('express');
const router = express.Router();
const {fundWallet, withdrawWallet } = require('../controllers/walletController');


// Fund Wallet
router.post('/fund-wallet', fundWallet)

// Withdraw from Wallet
router.post('/withdraw-wallet', withdrawWallet)


module.exports = router
