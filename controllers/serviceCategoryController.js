exports.createCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }
  
      const image = req.file.path; // cloudinary path
  
      const existing = await Category.findOne({ name });
      if (existing) return res.status(400).json({ message: 'Category already exists' });
  
      const category = await Category.create({ name, description, image });
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  };
  