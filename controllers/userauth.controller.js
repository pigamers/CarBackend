const bcrypt = require("bcryptjs")
const User = require("../models/user.models")

// get user details from frontend
// validation - not empty
// check if user already exists
// create usr object- create entry in db

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
        res.status(200).json({ message: "Login successful" })

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
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

