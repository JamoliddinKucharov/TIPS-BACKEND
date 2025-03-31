const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Sender = require("../models/Sender");

const JWT_SECRET = process.env.JWT_SECRET_KEY;


// Sender Register
const senderRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        username,
        password,
        email,
        phone,
        profilePicture,
    } = req.body;

    try {
        const exitingSender = await Sender.findOne({
            $or: [{ username }, { email }],
        });

        if (exitingSender) {
            const message =
                exitingSender.username === username
                    ? "username already exists!"
                    : "email already exists!";
            return res.status(400).json({ message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newSender = new Sender({
            username,
            password: hashedPassword,
            email,
            phone,
            profilePicture,
        });
        await newSender.save();

        const token = jwt.sign({ userId: newSender._id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ message: "Sender registered successfully", token });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Error" });
    }
};


const senderLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("Username and password are required");
        }

        const sender = await Sender.findOne({ username });
        if (!sender) {
            return res.status(404).send("Sender not found");
        }

        const isPasswordValid = await bcrypt.compare(password, sender.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }

        const token = jwt.sign({ userId: sender._id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(401).send("Internal Server Error");
    }
};


const senderGet = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const sender = await Sender.findById(decoded.userId);

        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        res.status(200).json({ message: "Sender found", sender });
    } catch (error) {
        console.error("Error verifying token:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        res.status(401).json({ message: "Server error" });
    }
};



const senderUpdate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { senderId } = req.params;
    const {
        username,
        password,
        email,
        phone,
        profilePicture,
    } = req.body;

    try {
        const sender = await Sender.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (email && email !== sender.email) {
            const existingEmail = await Sender.findOne({ email });
            if (existingEmail) {
                return res
                    .status(400)
                    .json({ message: "Sender email already exists" });
            }
        }

        sender.username = username || sender.username;
        sender.password = hashedPassword || sender.password;
        sender.email = email || sender.email;
        sender.phone = phone || sender.phone;
        sender.profilePicture = profilePicture || sender.profilePicture;

        await sender.save();

        res.status(200).json({ message: "Sender updated successfully", sender });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Server error" });
    }
};



module.exports = {
    senderRegister, senderLogin, senderGet,
    senderUpdate
};