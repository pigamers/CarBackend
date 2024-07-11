const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('User', UserSchema);