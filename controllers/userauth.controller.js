const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const User = require("../models/user.models")

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

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user data from the database
        const user = decoded.user; // Ensure decoded.userId is available and valid`

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.fullname);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }

}

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
                res.status(200).json({
                    token: token,
                    message: "Login successful, Please Wait..."
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
            return res.status(201).json({ message: "User created successfully!!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

