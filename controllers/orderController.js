const Order = require('../models/orderModel');

//  Create a new order
const placeOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'All order fields are required' });
    }

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
      status: 'pending'
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error while placing order' });
  }
};

//  Get all orders of a user
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

//  Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

//  Update order status (Admin or Vendor)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error while updating order' });
  }
};

//  Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
