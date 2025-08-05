const mongoose = require('mongoose');

// Variant schema remains the same
const VariantSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    options: [{ name: { type: String, required: true }, value: { type: String, required: true } }],
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true }
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // This links it to the Category model
        required: [true, 'Please add a category'],
    },
    imageUrl: { type: String, required: true },

    // --- THE CORE IMPROVEMENT ---
    productType: {
        type: String,
        required: true,
        enum: ['simple', 'variant'], // Can only be one of these two types
        default: 'simple'
    },

    // --- FIELDS FOR 'simple' PRODUCTS ---
    // These are used ONLY if productType is 'simple'
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    // --- FIELDS FOR 'variant' PRODUCTS ---
    // These are used ONLY if productType is 'variant'
    optionNames: { type: [String] },
    variants: [VariantSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);