const Product = require('../models/Product');

const Category = require('../models/Category'); // Make sure Category model is imported at the top


// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
    try {
        // The request body will now contain the complex product object with variants
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        // Provide more specific error messages
        res.status(400).json({ success: false, msg: err.message || 'Failed to create product' });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
    try {
        // Using findByIdAndUpdate is the cleanest way to handle this.
        // It will take the request body and apply all valid fields to the document.
        // The { new: true } option ensures it returns the updated document.
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        // This will now correctly report validation errors from the model
        res.status(400).json({ success: false, msg: err.message || 'Failed to update product' });
    }
};


// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// In server/controllers/productController.js

// @desc    Get all products (with filtering)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        // --- NEW: Filtering logic ---
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category; // Filter by category ID
        }
        if (req.query.subcategory) {
            filter.subcategory = req.query.subcategory;
        }

        const products = await Product.find(filter); // Apply the filter
        res.status(200).json({success: true, data: products});
    } catch (error) {
        res.status(500).json({success: false, message: 'Server Error'});
    }
};

// This function now works for both simple and variant products
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message || 'Failed to create product' });
    }
};

// This function now works for both simple and variant products
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message || 'Failed to update product' });
    }
};


// @desc    Get products by category slug
// @route   GET /api/products/category/:slug
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
    try {
        const parentCategory = await Category.findOne({ slug: req.params.slug });
        if (!parentCategory) {
            return res.status(404).json({ success: false, msg: 'Category not found' });
        }

        // --- THIS IS THE FIX ---
        // 1. Find all child categories of the parent.
        const childCategories = await Category.find({ parent: parentCategory._id });
        // 2. Create an array of all relevant category IDs (the parent PLUS all its children).
        const categoryIds = [parentCategory._id, ...childCategories.map(c => c._id)];

        // 3. Find all products where the category field is in our array of IDs.
        const products = await Product.find({ category: { $in: categoryIds } });

        res.status(200).json({ success: true, data: products, categoryName: parentCategory.name });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};