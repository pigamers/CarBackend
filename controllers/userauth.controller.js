const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const User = require("../models/user.models");
const { signupEmail, loginEmail } = require('../utils/mailer');

// get user details from frontend
// validation - not empty
// check if user already exists
// create usr object- create entry in db
// create a jwt token after successful login
// send token to frontend

exports.getUserProfile = async (req, res) => {
    try {
        const user = req.user; // Set by middleware

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            fullname: user.fullname,
            email: user.email,
            contactNumber: user.contactNumber,
            id: user._id
        });

    } catch (error) {
        console.error("Error in getUserProfile:", error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from middleware
        const { fullname, contactNumber, email } = req.body;

        // Validate input
        if (!fullname || !contactNumber || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Prepare update data
        const updateData = {
            fullname: fullname.trim(),
            contactNumber: contactNumber,
            email: email.toLowerCase().trim()
        };

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found in database' });
        }

        // Create new token with updated user data
        const newToken = jwt.sign(
            {
                user: {
                    id: updatedUser._id,
                    fullname: updatedUser.fullname,
                    email: updatedUser.email,
                    contactNumber: updatedUser.contactNumber
                }
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                contactNumber: updatedUser.contactNumber
            },
            token: newToken
        });

    } catch (error) {
        console.error("Error in updateUserProfile:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const payload = {
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                contactNumber: user.contactNumber
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Send login email notification
        try {
            await loginEmail(user.email);
        } catch (emailError) {
            console.error("Login email failed:", emailError);
        }

        res.status(200).json({
            token,
            user: payload.user,
            message: "Login successful!!"
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.signup = async (req, res) => {
    try {
        const { fullname, contactNumber, email, password } = req.body;

        if (!fullname || !contactNumber || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check existing user
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { contactNumber }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists!!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            fullname: fullname.trim(),
            contactNumber,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        // Send welcome email
        try {
            await signupEmail(newUser.email);
        } catch (emailError) {
            console.error("Signup email failed:", emailError);
        }

        res.status(201).json({
            message: "User created successfully!!"
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const userId = req.user.id; // From auth middleware

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New password and confirm password do not match"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if new password is same as old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password cannot be the same as the old password"
            });
        }

        // Hash and update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

