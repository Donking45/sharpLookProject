const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { venAuth } = require('../middlewares/venhMiddleware');

// Public
router.get('/product', getAllProducts);
router.get('/product/:id', getProductById);

// Vendor-only
router.post('/product/create', venAuth, createProduct);
router.put('/product/:id', venAuth, updateProduct);
router.delete('/product/:id', venAuth, deleteProduct);

module.exports = router;
