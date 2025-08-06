const express = require('express');

const upload = require('../middleware/uploadMiddleware');

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct, getProductsByCategory,
} = require('../controllers/productController');

const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(getProducts)
    .post(protect, authorize('admin'),upload , createProduct);

router
    .route('/:id')
    .get(getProduct)
    .put(protect, authorize('admin'),upload, updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;

// ADD THIS ROUTE
router.route('/category/:slug').get(getProductsByCategory);

module.exports = router;