const axios = require('axios');
const Order = require('../models/orderModel');

const initiateProductPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('user');

    const response = await axios.post('https://api.paystack.co/transaction/initialize',
      {
        email: order.user.email,
        amount: order.totalAmount * 100, // in kobo
        metadata: {
          orderId: order._id.toString(),
          custom_fields: [
            {
              display_name: "Customer ID",
              value: order.user._id.toString()
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });

    res.status(200).json({ message: 'Payment initiated', data: response.data.data });
  } catch (error) {
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
};


module.exports =  {initiateProductPayment};