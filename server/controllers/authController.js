const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

exports.register = async (req, res, next) => {
    // --- THE FIX IS HERE: Add `role` to the destructuring ---
    const {
        firstName, lastName, email, phone, password,
        address, city, state, zipcode, role // <-- ADDED `role`
    } = req.body;

    try {
        // --- AND HERE: Pass the `role` to the User.create method ---
        const user = await User.create({
            firstName, lastName, email, phone, password,
            address, city, state, zipcode,
            role // <-- ADDED `role`
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(201).json({ success: true, msg: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    // The frontend will send an 'identifier' field
    const { identifier, password } = req.body;

    // Validate identifier & password
    if (!identifier || !password) {
        return res.status(400).json({ success: false, msg: 'Please provide an email/mobile and password' });
    }

    // Check if the identifier is an email or a phone number
    // Using MongoDB's $or operator is efficient for this
    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    }).select('+password');

    if (!user) {
        return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create the payload for the token with more user info
    const payload = {
        id: user._id,
        role: user.role,
        firstName: user.firstName
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token
    });
};