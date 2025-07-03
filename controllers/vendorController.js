// vendorRegister, uploadDocs, setAvailability, setServiceArea, getProfile

const Vendor = require('../models/Vendor');
//const bcrypt = require('bcryptjs');

const vendorRegister = async (req, res) => {
  const { name, email, phoneNumber, password, category, bio, location } = req.body;
  try {
    const existing = await Vendor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    
    const vendor = new Vendor({
      name, email, phoneNumber, password, category, bio, location,
    
    });

    await vendor.save();
    res.status(201).json({ message: 'Vendor registered successfully', vendorId: vendor._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.module = vendorRegister