const Transaction = require('../models/transactionModel');

const createTransaction = async (req, res) => {
  try {
    const { userId, amount, type, status } = req.body;

    if (!user || !amount || !type) {
      return res.status(400).json({ message:'All required fields must be provided'})
    }

    const transaction = new Transaction({
      userId,
      amount,
      type,
      status
    });

    const savedTransaction = await transaction.save();
    res.status(201).json({
      message: 'Transaction created successfully', data: savedTransaction
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to create transaction', error: error.message
    })
  }
}


// Get Transaction History
const getTransactions =  async (req, res) => {
    const { userId } = req.params;
  
    try {
      const transactions = await Transaction.find({ userId }).sort({ date: -1 });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error });
    }
  };
  
  module.exports = {getTransactions, createTransaction};
  