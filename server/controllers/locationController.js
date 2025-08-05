const Location = require('../models/Location');

// @desc    Get all states
// @route   GET /api/locations/states
exports.getStates = async (req, res) => {
    try {
        const locations = await Location.find().sort('state');
        const states = locations.map(loc => loc.state);
        res.status(200).json({ success: true, data: states });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get cities for a specific state
// @route   GET /api/locations/cities/:state
exports.getCitiesByState = async (req, res) => {
    try {
        const location = await Location.findOne({ state: req.params.state });
        if (!location) {
            return res.status(404).json({ success: false, msg: 'State not found' });
        }
        res.status(200).json({ success: true, data: location.cities.sort() });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};