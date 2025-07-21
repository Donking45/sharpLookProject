const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authorization } = require('../middlewares/authMiddleware');

// Public
router.get('/product', getAllProducts);
router.get('/product/:id', getProductById);

// Vendor-only
router.post('/product/create', authorization, createProduct);
router.put('/product/:id', authorization, updateProduct);
router.delete('/product/:id', authorization, deleteProduct);

module.exports = router;
