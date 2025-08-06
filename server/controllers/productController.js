const Product = require('../models/Product');
const Category = require('../models/Category'); // Ensure Category model is imported

/**
 * Consolidates all product fetching logic.
 * - Populates category details for better display.
 * - Handles filtering from query parameters.
 */
exports.getProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        // NOTE: subcategory filter is removed as it's not in the Product model.

        const products = await Product.find(filter).populate('category', 'name slug');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Fetches a single product by its ID.
 */
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        console.error('Get Product Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Creates a new product, handling file uploads from multer.
 */
exports.createProduct = async (req, res) => {
    try {
        // Multer adds the file to req.file and text fields to req.body
        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'Please upload an image' });
        }

        const productData = { ...req.body };

        // The image URL is the path where multer saved the file.
        // We replace backslashes with forward slashes for URL compatibility.
        productData.imageUrl = req.file.path.replace(/\\/g, "/");

        // Parse variants and optionNames if they are stringified JSON from FormData
        if (productData.productType === 'variant') {
            if (req.body.variants) productData.variants = JSON.parse(req.body.variants);
            if (req.body.optionNames) productData.optionNames = JSON.parse(req.body.optionNames);
        }

        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        console.error('Create Product Error:', err);
        res.status(400).json({ success: false, msg: err.message || 'Failed to create product' });
    }
};

/**
 * Updates an existing product, handling optional new file uploads.
 */
exports.updateProduct = async (req, res) => {
    try {
        const productData = { ...req.body };

        // If a new file is uploaded, update the imageUrl. Otherwise, the old one remains.
        if (req.file) {
            productData.imageUrl = req.file.path.replace(/\\/g, "/");
        }

        // Parse variants and optionNames if they are stringified JSON
        if (productData.productType === 'variant') {
            if (req.body.variants) productData.variants = JSON.parse(req.body.variants);
            if (req.body.optionNames) productData.optionNames = JSON.parse(req.body.optionNames);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, productData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        console.error('Update Product Error:', err);
        res.status(400).json({ success: false, msg: err.message || 'Failed to update product' });
    }
};

/**
 * Deletes a product by its ID.
 */
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        // Optional: You could add code here to delete the actual image file from the server.
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Delete Product Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Gets all products belonging to a parent category or its children.
 */
exports.getProductsByCategory = async (req, res) => {
    try {
        const parentCategory = await Category.findOne({ slug: req.params.slug });
        if (!parentCategory) {
            return res.status(404).json({ success: false, msg: 'Category not found' });
        }

        const childCategories = await Category.find({ parent: parentCategory._id });
        const categoryIds = [parentCategory._id, ...childCategories.map(c => c._id)];

        const products = await Product.find({ category: { $in: categoryIds } }).populate('category', 'name slug');

        res.status(200).json({ success: true, data: products, categoryName: parentCategory.name });
    } catch (err) {
        console.error('Get by Category Error:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};