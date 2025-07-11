const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);



// Book an appointment and initialize payment
const bookAppointment = async (req, res) => {
  const { date, time, specialist, totalPayment } = req.body;

  try {
    const appointment = new Appointment({ date, time, specialist, totalPayment });
    await appointment.save();

    // Initialize Paystack payment
    const paystackResponse = await Paystack.transaction.initialize({
      email: 'customer@example.com', // Replace with user's email
      amount: totalPayment * 100, // Amount in kobo (NGN)
      reference: `appointment_${appointment._id}_${Date.now()}`,
      callback_url: 'https://yourdomain.com/api/appointments/verify-payment', // Replace with your callback URL
      metadata: { appointmentId: appointment._id }
    });

    res.status(200).json({
      message: 'Payment initialized',
      appointment,
      authorization_url: paystackResponse.data.authorization_url,
      reference: paystackResponse.data.reference
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error });
  }
};


const verifyPayment = async (req, res) => {
  const { reference } = req.query;

  try {
    const paystackResponse = await Paystack.transaction.verify({ reference });

    if (paystackResponse.data.status === 'success') {
      const appointment = await Appointment.findOneAndUpdate(
        { transactionRef: reference },
        { paymentStatus: 'paid', transactionRef: reference },
        { new: true }
      );
      res.status(200).json({ message: 'Payment verified', appointment });
    } else {
      await Appointment.findOneAndUpdate(
        { transactionRef: reference },
        { paymentStatus: 'failed' }
      );
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error });
  }
};

// Get all appointments
const getAllAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};


 module.exports = {
    bookAppointment,
    verifyPayment,
    getAllAppointment
 }