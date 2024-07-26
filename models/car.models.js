const mongoose = require("mongoose");

const OwnerSchema = mongoose.Schema({
    OwnerName: {
        type: String,
        required: true,
    },
    OwnerContact: {
        type: Number,
        required: true,
        unique: true
    },
    OwnerAddress: {
        type: String,
        required: true,
    },
    OwnerEmail: {
        type: String,
        required: true,
        unique: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Owner', OwnerSchema);