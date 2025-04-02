const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Fundraising = require("../models/Fundraising");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
    console.error("JWT_SECRET_KEY is not defined!");
    return res.status(500).json({ message: "Internal server error" });
}

// Fundraising Register
const fundraisingRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        username,
        password,
        email,
        phone,
        image,
    } = req.body;


    try {
        const exitingFundraising = await Fundraising.findOne({
            $or: [{ username }, { email }],
        });

        if (exitingFundraising) {
            const message =
                exitingFundraising.username === username
                    ? "username already exists!"
                    : "email already exists!";
            return res.status(400).json({ message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newFundraising = new Fundraising({
            username,
            password: hashedPassword,
            email,
            phone,
            image,
        });
        await newFundraising.save();

        const token = jwt.sign({ userId: newFundraising._id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ message: "Fundraising registered successfully", token });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Error" });
    }
};


const fundraisingLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("Username and password are required");
        }

        const fundraising = await Fundraising.findOne({ username });
        if (!fundraising) {
            return res.status(404).send("Fundraising not found");
        }

        const isPasswordValid = await bcrypt.compare(password, fundraising.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }

        const token = jwt.sign({ userId: fundraising._id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(401).send("Internal Server Error");
    }
};


const fundraisingGet = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const fundraising = await Fundraising.findById(decoded.userId);

        if (!fundraising) {
            return res.status(404).json({ message: "Fundraising not found" });
        }

        res.status(200).json({ message: "Fundraising found", fundraising });
    } catch (error) {
        console.error("Error verifying token:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        res.status(401).json({ message: "Server error" });
    }
};



const fundraisingUpdate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { fundraisingId } = req.params;
    const {
        username,
        password,
        email,
        phone,

        collection,
        name,
        type,
        price,
        comment, 
    } = req.body;


    const image = req.file ? req.file.filename : null;

    try {
        const fundraising = await Fundraising.findById(fundraisingId);
        if (!fundraising) {
            return res.status(404).json({ message: "Fundraising not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (email && email !== fundraising.email) {
            const existingEmail = await Fundraising.findOne({ email });
            if (existingEmail) {
                return res
                    .status(400)
                    .json({ message: "Fundraising email already exists" });
            }
        }

        if (image) {
            if (fundraising.photo) {
                const oldImagePath = path.join(__dirname, "../uploads/", fundraising.photo);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            fundraising.photo = image;
        }
        fundraising.username = username || fundraising.username;
        fundraising.password = hashedPassword || fundraising.password;
        fundraising.email = email || fundraising.email;
        fundraising.phone = phone || fundraising.phone;
        fundraising.collection = collection || fundraising.collection;
        fundraising.name = name || fundraising.name;
        fundraising.type = type || fundraising.type;
        fundraising.price = price || fundraising.price;
        fundraising.comment = comment || fundraising.comment;

        await fundraising.save();

        res.status(200).json({ message: "Fundraising updated successfully", fundraising });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Server error" });
    }
};



module.exports = {
    fundraisingRegister, fundraisingLogin, fundraisingGet,
    fundraisingUpdate
};