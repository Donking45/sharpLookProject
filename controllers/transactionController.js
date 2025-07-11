const Transaction = require('../models/transactionModel');


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
  
  module.exports = {getTransactions};
  