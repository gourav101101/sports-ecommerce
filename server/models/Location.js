const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        unique: true,
    },
    cities: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model('Location', LocationSchema);