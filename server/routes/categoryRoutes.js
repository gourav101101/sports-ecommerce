const express = require('express');
const router = express.Router();

// Import all required functions and middleware using 'require'
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Define the routes with absolute clarity ---

// Route for GETting all categories and POSTing a new one
router.get('/', getCategories);
router.post('/', protect, authorize('admin'), createCategory);

// Route for PUTting and DELETing a specific category by its ID
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

// Export the router for use in server.js
module.exports = router;