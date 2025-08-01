const Product = require('../models/productModel');
const cloudinary = require('../utils/cloudinary');
const Vendor = require('../models/vendorModel');

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor only)
const createProduct = async (req, res) => {

    const { name, description, price, category, image, vendorId} = req.body;

    if(!vendorId || !name || !description || !category || !price || !image){
      return res.status(400).json({
        message: "Please enter all fields"
      })
  }

    try {
      console.log("Uploading image to Cloudinary...");
      const result = await cloudinary.uploader.upload(image, {
        folder: "onlineShop",
        width: 300,
        crop: "scale"
      });

      console.log("Uploading result:", result);

      const product = new Product ({
        name,
        description,
        price,
        category,
        vendorId,
        image: {
          public_id: result.public_id,
          url: result.secure_url
        },
      });

      const savedProduct = await product.save();
      res.status(200).send(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error );
        res.status(500).json({
          message: "Internal server error",
          error: error.message || error
        });
    }
};


// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('vendorId', 'businessName');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get products', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendorId', 'businessName');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendorId.toString() !== req.vendor.id)
      return res.status(403).json({ message: 'Not authorized to update this product' });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendorId.toString() !== req.vendor.id)
      return res.status(403).json({ message: 'Not authorized to delete this product' });

    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
