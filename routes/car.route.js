const express = require('express');
const router = express.Router();
const {
    getCarDetails,
    getaCarDetail,
    postCarDetails
} = require('../controllers/cardetail.controller')

// Route for getting car details
router.get("/getcar", getCarDetails);
router.get("/getcar/:id", getaCarDetail);

// Route for posting car details
router.post("/postcar", postCarDetails);

module.exports = router;