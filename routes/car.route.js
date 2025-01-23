const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getCarDetails,
    getaCarDetail,
    postCarDetails,
    uploadCarImagesAndVideos
} = require('../controllers/cardetail.controller')

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'video') {
            if (file.mimetype.startsWith('video/')) {
                cb(null, true);
            } else {
                cb(new Error('Only video files are allowed for video upload'));
            }
        } else if (file.fieldname === 'images') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for image upload'));
            }
        } else {
            cb(new Error('Unexpected field'));
        }
    }
});

// Define upload fields (4 images and 1 video)
const uploadFields = upload.fields([
    { name: 'images', maxCount: 4 },
    { name: 'video', maxCount: 1 }
]);

// Route for getting car details
router.get("/getcar", getCarDetails);
router.get("/getcar/:id", getaCarDetail);

// Route for posting car details
router.post("/postcar", postCarDetails);

// Route for images upload
router.post("/upload", uploadFields, uploadCarImagesAndVideos);

module.exports = router;