const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { authorization } = require('../middlewares/authMiddleware');

// Create a new order
router.post('/order/create', authorization, placeOrder);

// Get all orders for a user
router.get('/order', authorization, getOrders);

// Get a specific order by ID
router.get('/order/:id', authorization, getOrderById);


module.exports = router;
