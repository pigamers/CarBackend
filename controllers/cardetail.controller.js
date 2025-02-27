const CarDetails = require("../models/car.models");
const cloudinary = require('../utils/cloudinary'); // Import the Cloudinary configuration
const fs = require('fs');

exports.getCarDetails = async (req, res) => {
    try {
        const car = await CarDetails.find();
        res.status(200).json(car);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.getaCarDetail = async (req, res) => {
    try {
        const car = await CarDetails.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.uploadCarImagesAndVideos = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadedFiles = [];

        // Handle images
        if (req.files.images) {
            const imageFiles = Array.isArray(req.files.images)
                ? req.files.images
                : [req.files.images];

            for (const file of imageFiles) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(file.path);
                    uploadedFiles.push({
                        fieldname: file.fieldname,
                        url: uploadResult.secure_url,
                    });
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                }
            }
        }

        // Handle video
        if (req.files.video) {
            const videoFile = Array.isArray(req.files.video)
                ? req.files.video[0]
                : req.files.video;

            try {
                const uploadResult = await cloudinary.uploader.upload(videoFile.path, {
                    resource_type: 'video',
                });
                uploadedFiles.push({
                    fieldname: videoFile.fieldname,
                    url: uploadResult.secure_url,
                });
            } catch (uploadError) {
                console.error('Video upload error:', uploadError);
            }
        }

        if (uploadedFiles.length === 0) {
            return res.status(500).json({
                message: "Failed to upload files"
            });
        }

        // Clean up: Remove files from local storage after upload
        Object.values(req.files).flat().forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        });

        res.status(200).json({
            message: "Files uploaded successfully",
            uploadedFiles: uploadedFiles,
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.postCarDetails = async (req, res) => {
    try {
        const {
            OwnerName,
            OwnerContact,
            OwnerAddress,
            OwnerEmail,
            MakeOfCar,
            Model,
            Year,
            Mileage,
            Color,
            Condition,
            AccidentHistory,
            ServiceHistory,
            InsuranceStatus,
            TaxUptill,
            FrontView,
            BackView,
            RearSideView1,
            RearSideView2,
            ExteriorVideo,
        } = req.body;

        // Check if an owner with the same contact or email already exists
        const existingCar = await CarDetails.findOne({
            $or: [{ OwnerEmail }, { OwnerContact }]
        });

        if (existingCar) {
            return res.status(400).json({ message: "Email or Contact Already Exists!!" });
        }

        // Create a new car details document with URLs passed from the upload step
        const newCarDetails = new CarDetails({
            OwnerName,
            OwnerContact,
            OwnerAddress,
            OwnerEmail,
            MakeOfCar,
            Model,
            Year,
            Mileage,
            Color,
            Condition,
            AccidentHistory,
            ServiceHistory,
            InsuranceStatus,
            TaxUptill,
            FrontView,
            BackView,
            RearSideView1,
            RearSideView2,
            ExteriorVideo
        });

        // Save the new car details to the database
        await newCarDetails.save();

        // Return success response
        res.status(201).json({ message: "Car details posted successfully!", carDetails: newCarDetails });
    } catch (error) {
        console.error("Error in creating car details:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
