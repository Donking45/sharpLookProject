const Paystack = require('node-paystack');
const Payment = require('../models/paystackModel')
const https = require('https');

const initializePayment = async (req, res) => {
  const params = JSON.stringify({
    email: req.body.email,
    amount: req.body.amount * 100, 
  });

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 
      'Content-Type': 'application/json',
    },
  };

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.status) {
          res.status(200).json(parsedData);
        } else {
          res.status(400).json({ message: 'Payment initialization failed', data: parsedData });
        }
      } catch (err) {
        console.error('Parsing error:', err);
        res.status(500).json({ message: 'Server error during payment initialization' });
      }
    });
  });

  request.on('error', (error) => {
    console.error('HTTPS error:', error);
    res.status(500).json({ message: 'Payment request failed', error: error.message });
  });

  request.write(params);
  request.end();
};

module.exports = { initializePayment };


