const express = require('express');
const router = express.Router();
const {
    getCarDetails,
    postCarDetails
} = require('../controllers/cardetail.controller')

// Route for getting car details
router.get("/getcar", getCarDetails);

// Route for posting car details
router.post("/postcar", postCarDetails);

module.exports = router;