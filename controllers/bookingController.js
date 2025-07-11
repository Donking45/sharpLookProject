const Booking = require('../models/bookingModel');
const Vendor = require('../models/vendorModel');

const createBookings = async (req, res) => {
  try {
    const { vendorId, serviceType, appointmentDate, timeSlot, location, notes } = req.body;
    const clientId = req.user.id;

    if (!vendorId || !serviceType || !appointmentDate || !timeSlot || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const booking = await Booking.create({
      client: clientId,
      vendor: vendorId,
      serviceType,
      appointmentDate,
      timeSlot,
      location,
      notes,
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getClientBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id })
      .populate('vendor', 'businessName serviceType profileImage');

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getVendorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendor: req.vendor.id })
      .populate('client', 'firstName lastName email');

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createBookings,
  getClientBookings,
  getVendorBookings
}