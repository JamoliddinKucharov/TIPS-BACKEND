const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Company = require("../models/Company");

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";

// Admin Register
const registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const existingUser = await Admin.findOne();
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      role: "superadmin",
    });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("Admin not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// User Register
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    username,
    password,
    firstName,
    lastName,
    email,
    phone,
    address,
    brand,
    inn,
  } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const message =
        existingUser.username === username
          ? "Username already exists!"
          : "Email already exists!";
      return res.status(400).json({ message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phone,
      address,
      brand,
      inn,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required!");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Company Register
const registerCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    companyName,
    companyPassword,
    companyEmail,
    companyImage,
    companyPhone,
  } = req.body;

  try {
    const exitingCompany = await Company.findOne({
      $or: [{ companyName }, { companyEmail }],
    });

    if (exitingCompany) {
      const message =
        exitingCompany.companyName === companyName
          ? "CompanyName already exists!"
          : "CompanyEmail already exists!";
      return res.status(400).json({ message });
    }

    const hashedPassword = await bcrypt.hash(companyPassword, 10);
    const newCompany = new Company({
      companyName,
      companyPassword: hashedPassword,
      companyEmail,
      companyImage,
      companyPhone,
    });
    await newCompany.save();

    res.status(201).json({ message: "Company registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
const loginCompany = async (req, res) => {
  try {
    const { companyName, companyPassword } = req.body;
    if (!companyName || !companyPassword) {
      return res.status(400).send("companyName and password are required!");
    }

    const company = await Company.findOne({ companyName });
    if (!company) {
      return res.status(404).send("Company not found");
    }

    const isPasswordValid = await bcrypt.compare(
      companyPassword,
      company.companyPassword
    );
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ userId: company._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser,
  registerCompany,
  loginCompany,
};
