const ServiceCategory = require('../models/serviceCategoryModel');

const getCategories = async (req, res) => {
    try {
        const categories = await ServiceCategory.find();
        res.status(200).json({ categories });
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getCategories };