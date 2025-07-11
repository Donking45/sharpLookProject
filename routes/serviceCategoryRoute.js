const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { upload } = require('../utils/cloudinary');

// Public
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin-only or secured
router.post('/', upload.single('image'), createCategory);
router.put('/:id', upload.single('image'), updateCategory); // Optional image update
router.delete('/:id', deleteCategory);

module.exports = router;
