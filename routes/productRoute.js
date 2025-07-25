const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { vendorAuth } = require('../middlewares/venMiddleware');

// Public
router.get('/product', getAllProducts);
router.get('/product/:id', getProductById);

// Vendor-only
router.post('/product/create', vendorAuth, createProduct);
router.put('/product/:id', vendorAuth, updateProduct);
router.delete('/product/:id', vendorAuth, deleteProduct);

module.exports = router;
