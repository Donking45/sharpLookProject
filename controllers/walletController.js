const express = require('express');
const router = express.Router();
const Wallet = require('../models/walletModel');


// Fund Wallet
const fundWallet = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
    }
    wallet.balance += amount;
    await wallet.save();

    const transaction = new Transaction({
      userId,
      type: 'fund',
      amount,
      description: 'Wallet funding'
    });
    await transaction.save();

    res.status(200).json({ message: 'Wallet funded successfully', balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error funding wallet', error });
  }
};

// Withdraw from Wallet
const withdrawWallet = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.balance -= amount;
    await wallet.save();

    const transaction = new Transaction({
      userId,
      type: 'withdraw',
      amount,
      description: 'Wallet withdrawal'
    });
    await transaction.save();

    res.status(200).json({ message: 'Withdrawal successful', balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error withdrawing from wallet', error });
  }
};

module.exports ={ fundWallet, withdrawWallet};