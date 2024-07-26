const express = require('express');
const router = express.Router();

const {
    login,
    signup,
    getUserProfile
} = require('../controllers/userauth.controller');

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Example route for getting user profile
router.get("/profile", getUserProfile);


module.exports = router;