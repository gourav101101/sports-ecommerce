const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getMyOrders,
    getOrders,
    getOrderById
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

module.exports = router;