const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false,
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    city: {
        type: String,
        required: [true, 'Please add a city'],
    },
    state: {
        type: String,
        required: [true, 'Please add a state'],
    },
    zipcode: {
        type: String,
        required: [true, 'Please add a zipcode'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);