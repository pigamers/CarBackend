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
    try {
        const { OwnerName, OwnerContact, OwnerAddress, OwnerEmail } = req.body;

        // Check if user with the same email already exists
        const existingOwner = await Owner.findOne({ OwnerEmail } || { OwnerContact });

        if (existingOwner) {
            return res.status(400).json({ message: "Email or Contact Already Exists!!" });
        }

        // Create a new user
        const newOwner = await Owner.create({
            OwnerName, 
            OwnerContact, 
            OwnerAddress, 
            OwnerEmail
        });

        // Respond with success message if user is created successfully
        if (newOwner) {
            return res.status(201).json({ message: "Details posted successfully!!" });
        }
    } catch (error) {
        console.error("Error in creating owner:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}