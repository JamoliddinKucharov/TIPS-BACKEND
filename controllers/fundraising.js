const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Fundraising = require("../models/Fundraising");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// 🔐 JWT mavjudligini tekshirish
const fundraisingHandler = async (req, res) => {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET_KEY is not defined!");
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Ro‘yxatdan o‘tish
const fundraisingRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password, email, phone, userId } = req.body;
  const photo = req.file?.filename || null;

  try {
    const existing = await Fundraising.findOne({
      $or: [{ username }, { email }],
    });

    if (existing) {
      const message = existing.username === username
        ? "Username already exists"
        : "Email already exists";
      return res.status(400).json({ message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFundraising = new Fundraising({
      username,
      password: hashedPassword,
      email,
      phone,
      userId,
      photo,
    });

    await newFundraising.save();

    const token = jwt.sign({ userId: newFundraising._id }, JWT_SECRET);
    res.status(201).json({ message: "Fundraising registered successfully", token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration error" });
  }
};

// ✅ Login
const fundraisingLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Email and password are required");

    const fundraising = await Fundraising.findOne({ email });
    if (!fundraising)
      return res.status(404).send("Fundraising not found");

    const isValid = await bcrypt.compare(password, fundraising.password);
    if (!isValid)
      return res.status(401).send("Invalid password");

    const token = jwt.sign({ userId: fundraising._id }, JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Profilni olish
const fundraisingGet = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const fundraising = await Fundraising.findById(decoded.userId);
    if (!fundraising)
      return res.status(404).json({ message: "Fundraising not found" });

    res.status(200).json({ message: "Fundraising found", fundraising });
  } catch (error) {
    console.error("Token verification error:", error);
    const msg = error.name === "TokenExpiredError"
      ? "Token expired"
      : "Invalid token";
    res.status(401).json({ message: msg });
  }
};

// ✅ Yangilash (rasm bilan)
const fundraisingUpdate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

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

  try {
    const fundraising = await Fundraising.findById(fundraisingId);
    if (!fundraising)
      return res.status(404).json({ message: "Fundraising not found" });

    // email takrorlanmasligi
    if (email && email !== fundraising.email) {
      const exists = await Fundraising.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already exists" });
    }

    // 📸 Rasm yangilanishi
    if (req.file && req.file.filename) {
      const newPhoto = req.file.filename;
      const oldPath = path.join(__dirname, "../uploads/", fundraising.photo || "");
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      fundraising.photo = newPhoto;
    }

    // 📝 Boshqa maydonlar
    fundraising.username = username || fundraising.username;
    fundraising.email = email || fundraising.email;
    fundraising.phone = phone || fundraising.phone;
    fundraising.collection = collection || fundraising.collection;
    fundraising.name = name || fundraising.name;
    fundraising.type = type || fundraising.type;
    fundraising.price = price || fundraising.price;
    fundraising.comment = comment || fundraising.comment;

    // 🔐 Parol yangilanishi
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fundraising.password = hashed;
    }

    await fundraising.save();
    res.status(200).json({ message: "Fundraising updated successfully", fundraising });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = {
  fundraisingRegister,
  fundraisingLogin,
  fundraisingGet,
  fundraisingUpdate,
  fundraisingHandler,
};
