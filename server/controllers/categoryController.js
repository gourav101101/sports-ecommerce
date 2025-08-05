const Category = require('../models/Category');

// Helper function to create a URL-friendly slug
const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// @desc    Get all categories as a nested tree
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        // This logic builds the nested tree structure the frontend needs
        const categoryMap = {};
        const nestedCategories = [];

        categories.forEach(category => {
            categoryMap[category._id] = { ...category.toObject(), children: [] };
        });

        categories.forEach(category => {
            if (category.parent) {
                categoryMap[category.parent]?.children.push(categoryMap[category._id]);
            } else {
                nestedCategories.push(categoryMap[category._id]);
            }
        });

        res.status(200).json({ success: true, data: nestedCategories });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
    const { name, parent } = req.body;
    try {
        const category = await Category.create({
            name,
            slug: slugify(name), // Auto-generate the slug
            parent: parent || null // Handle top-level categories
        });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to create category. Name might already exist.' });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
    const { name, parent } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name,
            slug: slugify(name),
            parent: parent || null
        }, { new: true, runValidators: true });

        if (!category) {
            return res.status(404).json({ success: false, msg: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to update category.' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        // --- PROFESSIONAL CHECK: Prevent deleting a category if it has children ---
        const subcategories = await Category.find({ parent: req.params.id });
        if (subcategories.length > 0) {
            return res.status(400).json({ success: false, msg: 'Cannot delete. This category has sub-categories.' });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, msg: 'Category not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};