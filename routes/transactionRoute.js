const {getTransactions} = require('../controllers/transactionController');

// Get Transaction History
router.get('/transactions/:userId', getTransactions)
  
  module.exports = router;
  