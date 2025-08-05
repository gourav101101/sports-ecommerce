const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
    const { orderItems, shippingInfo, totalPrice, paymentResult } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ success: false, msg: 'No order items' });
    }

    try {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingInfo,
            totalPrice,
            paymentResult,
            isPaid: true, // Assuming payment is successful
            paidAt: Date.now(),
        });

        const createdOrder = await order.save();
        res.status(201).json({ success: true, data: createdOrder });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error', error: err.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, msg: 'Order not found' });
        }

        // Make sure the user is the owner of the order or an admin
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
