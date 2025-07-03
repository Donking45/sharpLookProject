// vendorRegister, uploadDocs, setAvailability, setServiceArea, getProfile


const Vendor = require('../models/vendorModel');
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


const uploadDocs = async (req, res) => {
  try {
    const { vendorId } = req.body;
    const { idCardUrl, certificateUrl } = req.body; // or use file upload logic


    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });


    vendor.documents = {
      idCard: idCardUrl,
      certificate: certificateUrl,
    };
    await vendor.save();


    res.status(200).json({ message: "Documents uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const setAvailability = async (req, res) => {
  try {
    const { vendorId, availability } = req.body;
    // Example: availability = { monday: ['9am-1pm', '3pm-6pm'], saturday: ['10am-2pm'] }


    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });


    vendor.availability = availability;
    await vendor.save();


    res.status(200).json({ message: "Availability set successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const setServiceArea = async (req, res) => {
  try {
    const { vendorId, radiusKm, address } = req.body;


    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });


    vendor.serviceArea = {
      radiusKm,
      address
    };
    await vendor.save();


    res.status(200).json({ message: "Service area set successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getVendorProfile = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findById(vendorId).select('-password'); // exclude password
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });


    res.status(200).json({ vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  vendorRegister,
  uploadDocs,
  setAvailability,
  setServiceArea,
  getVendorProfile
};
