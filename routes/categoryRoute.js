const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const upload  = require('../middlewares/multer');

// Public
router.get('/category', getAllCategories);
router.get('/category/:id', getCategoryById);

// Admin-only or secured
router.post('/category/create', upload.single('image'), createCategory);
router.put('/category/:id', upload.single('image'), updateCategory); // Optional image update
router.delete('/category/:id', deleteCategory);


module.exports = router;
