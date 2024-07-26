const Owner = require("../models/car.models");

exports.getCarDetails = async (req, res) => {
    try {
        const car = await User.findById(req.params.id);
        res.status(200).json(car);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.postCarDetails = async (req, res) => {
    
}