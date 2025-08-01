const Category = require('../models/Category');
const cloudinary = require('../utils/cloudinary');

// @desc Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    let imageUrl = '';
    if (image) {
      imageUrl = await cloudinary(image);
    }

    const newCategory = new Category({ name, image: imageUrl });
    const savedCategory = await newCategory.save();

    res.status(201).json({ message: 'Category created', data: savedCategory });
  } catch (err) {
    res.status(500).json({ message: 'Creation failed', error: err.message });
  }
};

// @desc Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ data: categories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve categories', error: err.message });
  }
};

// @desc Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ data: category });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Update category by ID
const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (name) category.name = name;
    if (image) {
      const imageUrl = await upload(image);
      category.image = imageUrl;
    }

    await category.save();
    res.status(200).json({ message: 'Category updated', data: category });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// @desc Delete category by ID
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
