const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { Resend } = require("resend");
const { OAuth2Client } = require("google-auth-library");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Company = require("../models/Company");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const resend = new Resend(process.env.RESEND_API_KEY);
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// ✅ Admin Register
const registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password, role } = req.body;

  try {
    if (!["superadmin", "infoadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await Admin.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Admin already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword, role });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("Username and password are required");

    const user = await Admin.findOne({ username });
    if (!user) return res.status(404).send("Admin not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send("Invalid password");

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ User Register
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password, firstName, lastName, email, phone, address, brand, inn, work } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const message = existingUser.username === username ? "Username already exists!" : "Email already exists!";
      return res.status(400).json({ message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username, password: hashedPassword, firstName, lastName, email, phone, work, address, brand, inn,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Email and password are required!");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send("Invalid password");

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Error");
  }
};

// ✅ Company Register
const registerCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { companyName, companyPassword, companyEmail, companyImage, companyPhone, companyInn, legalAddress } = req.body;

  try {
    const exitingCompany = await Company.findOne({ $or: [{ companyName }, { companyEmail }] });
    if (exitingCompany) {
      const message = exitingCompany.companyName === companyName ? "CompanyName already exists!" : "CompanyEmail already exists!";
      return res.status(400).json({ message });
    }

    const hashedPassword = await bcrypt.hash(companyPassword, 10);
    const newCompany = new Company({
      companyName, companyPassword: hashedPassword, companyEmail, companyImage, companyPhone, companyInn, legalAddress,
    });
    await newCompany.save();

    const token = jwt.sign({ userId: newCompany._id }, JWT_SECRET);
    res.status(201).json({ message: "Company registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};

// ✅ Company Login
const loginCompany = async (req, res) => {
  try {
    const { companyEmail, companyPassword } = req.body;
    if (!companyEmail || !companyPassword) return res.status(400).send("Email and password are required!");

    const company = await Company.findOne({ companyEmail });
    if (!company) return res.status(404).send("Company not found");

    const isPasswordValid = await bcrypt.compare(companyPassword, company.companyPassword);
    if (!isPasswordValid) return res.status(401).send("Invalid password");

    const token = jwt.sign({ userId: company._id }, JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Google Token Login (Flutter uchun)
const googleTokenLogin = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "idToken is required" });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        username: name,
        image: picture,
        password: "google-auth"
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Google token login error:", error);
    res.status(401).json({ message: "Invalid Google token", error: error.message });
  }
};

// ✅ Forgot Password
const forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  let Model;

  if (role === 'user') Model = User;
  else if (role === 'company') Model = Company;
  else if (role === 'admin') Model = Admin;
  else return res.status(400).json({ message: 'Invalid role' });

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `https://tips.instalady.uz/reset-password/${token}`;

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Click this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    if (error) {
      console.error("Email sending failed:", error);
      return res.status(500).json({ message: 'Email sending failed', error: error.message });
    }

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { id, role } = decoded;

    let Model;
    if (role === 'user') Model = User;
    else if (role === 'company') Model = Company;
    else if (role === 'admin') Model = Admin;
    else return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    if (role === 'company') user.companyPassword = hashed;
    else user.password = hashed;

    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Dashboard
const getDashboard = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Welcome to your dashboard!', user: req.user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// ✅ Logout
const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    res.json({ message: 'Successfully logged out' });
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser,
  registerCompany,
  loginCompany,
  googleTokenLogin,
  getDashboard,
  logout,
  forgotPassword,
  resetPassword,
};
