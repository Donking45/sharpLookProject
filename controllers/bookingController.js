const Booking = require('../models/bookingModel');

const createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json({ message: 'Booking created', booking})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
};

const getBookHistory = async (req, res) => {
    try {
        const history = await Booking.find({ user: req.user.id }).populate('vendor')
        res.status(200).json({ history })
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
}

module.exports = {
   createBooking,
   getBookHistory,
};