const express = require('express');
const router = express.Router();
const Wallet = require('../models/walletModel');
const Transaction = require("../models/transactionModel");
const { v4: uuidv4 } = require("uuid");


const fundWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: "User ID and amount are required." });
    }

    // Get user’s wallet
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      // Create a wallet for the user if it doesn't exist
      wallet = new Wallet({userId, balance: 0 });
    }

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save();

    // Create transaction
    const transaction = new Transaction({
      userId,
      type: "credit",
      amount,
      purpose: "wallet funding",
      reference: uuidv4(),
    });

    await transaction.save();

    res.status(200).json({
      message: "Wallet funded successfully",
      wallet,
      transaction,
    });

  } catch (error) {
    console.error("Error funding wallet:", error);
    res.status(500).json({
      message: "Error funding wallet",
      error: error.message || error,
    });
  }
};


const withdrawWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: "User ID and amount are required." });
    }

    // Find the user’s wallet
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found for this user." });
    }

    // Check if user has sufficient balance
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance." });
    }

    // Deduct amount from wallet
    wallet.balance -= amount;
    await wallet.save();

    // Log withdrawal as a transaction
    const transaction = new Transaction({
      userId,
      type: "debit",
      amount,
      purpose: "wallet withdrawal",
      reference: uuidv4(),
    });

    await transaction.save();

    res.status(200).json({
      message: "Withdrawal successful",
      wallet,
      transaction,
    });

  } catch (error) {
    console.error("Error withdrawing from wallet:", error);
    res.status(500).json({
      message: "Error processing withdrawal",
      error: error.message || error,
    });
  }
};

module.exports = { fundWallet, withdrawWallet }