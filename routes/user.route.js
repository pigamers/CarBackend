const express = require('express');
const router = express.Router();

const {
    login,
    signup,
    getUserProfile,
    updateUserProfile,
    changePassword
} = require('../controllers/userauth.controller');
const {
    verifyToken,
    validateLogin,
    validateSignup,
    validatePassword
} = require('../middleware/auth.middleware');

// Route for user login
router.post("/login", validateLogin, login);

// Route for user signup
router.post("/signup", validateSignup, signup);

// Example route for getting user profile
router.get("/profile", verifyToken, getUserProfile);

// route for updating profile
router.put("/update-profile", verifyToken, updateUserProfile);

// password reset route
router.post("/reset-password", verifyToken, validatePassword, changePassword);


module.exports = router;