const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { authorization } = require('../middlewares/authMiddleware');

// Create a new order
router.post('/create', authorization, placeOrder);

// Get all orders for a user
router.get('/', authorization, getOrders);

// Get a specific order by ID
router.get('/:id', authorization, getOrderById);


module.exports = router;
