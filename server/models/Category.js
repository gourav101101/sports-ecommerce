const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    },
    slug: { // For URL-friendly names, e.g., "cricket-bats"
        type: String,
        unique: true,
        required: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null // A null parent means it's a top-level category
    },
    icon: { // To store SVG data or an image URL for the icon
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);