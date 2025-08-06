const mongoose = require('mongoose');

// Variant schema
const VariantSchema = new mongoose.Schema({

    sku: { type: String, required: true, unique: true },
    //sku: { type: String, required: true }, // ❌ Do NOT mark as unique here
    //sku:{type: String},
    options: [{ name: { type: String, required: true }, value: { type: String, required: true } }],
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true }
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a category'],
    },
    imageUrl: { type: String, required: true },
    productType: {
        type: String,
        required: true,
        enum: ['simple', 'variant'],
        default: 'simple'
    },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    optionNames: { type: [String] },
    variants: [VariantSchema]
}, {
    timestamps: true
});

// --- FIX 2: Add a sparse unique index to the parent schema ---
// This tells MongoDB to only enforce uniqueness on documents that have this field.
// Simple products will be ignored by this index, fixing the error.
//ProductSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });
ProductSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });



module.exports = mongoose.model('Product', ProductSchema);