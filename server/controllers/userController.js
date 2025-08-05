const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    // The user's ID is available from the `protect` middleware (req.user.id)
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            success: true,
            data: user
        });
    } else {
        res.status(404).json({ success: false, msg: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        // Update the fields that are provided in the request body
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.city = req.body.city || user.city;
        user.state = req.body.state || user.state;
        user.zipcode = req.body.zipcode || user.zipcode;

        // We can add password change logic here later if needed, but not in this simple update

        const updatedUser = await user.save();

        res.json({
            success: true,
            msg: 'Profile updated successfully',
            data: updatedUser
        });
    } else {
        res.status(404).json({ success: false, msg: 'User not found' });
    }
};