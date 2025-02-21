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
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and log the decoded data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from decoded token
        const user = decoded.user;
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user data directly from token
        res.status(200).json({
            fullname: user.fullname,
            email: user.email,
            contactNumber: user.contactNumber
        });

    } catch (error) {
        console.error("Error in getUserProfile:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.user.id;
        
        const { fullname, contactNumber, email } = req.body;

        if (!fullname || !contactNumber || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Update user data
        const updateData = {
            fullname: fullname.trim(),
            contactNumber: contactNumber,
            email: email.toLowerCase().trim()
        };

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
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
            user: updatedUser,
            token: newToken
        });

    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                contactNumber: user.contactNumber,
                password: user.password
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) throw err
                loginEmail(payload.user.email);
                res.status(200).json({
                    token: token,
                    message: "Login successful!!"
                })
            }
        )

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

exports.signup = async (req, res) => {
    try {
        const { fullname, contactNumber, email, password } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email } || { contactNumber });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists!!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            fullname,
            contactNumber,
            email,
            password: hashedPassword
        });

        // Respond with success message if user is created successfully
        if (newUser) {
            signupEmail(newUser.email);
            return res.status(201).json({ message: "User created successfully!!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Fetch the user's old password hash
        const oldPasswordHash = user.password;

        // Check if the new password is the same as the old password
        const isSamePassword = await bcrypt.compare(newPassword, oldPasswordHash);
        if (isSamePassword) {
            return res.status(400).json({ message: "New password cannot be the same as the old password" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

