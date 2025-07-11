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
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Vendor-only
router.post('/', authorization, createProduct);
router.put('/:id', authorization, updateProduct);
router.delete('/:id', authorization, deleteProduct);

module.exports = router;
