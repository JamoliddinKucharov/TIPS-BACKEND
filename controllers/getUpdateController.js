const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const Company = require("../models/Company");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


// User ma'lumotlarini yangilash

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, password, firstName, lastName, email, phone, address, brand, inn } = req.body;

  const image = req.file ? req.file.filename : null; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (image) {
      if (user.photo) {
        const oldImagePath = path.join(__dirname, "../uploads/", user.photo);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      user.photo = image;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.brand = brand || user.brand;
    user.inn = inn || user.inn;
    user.username = username || user.username;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateUser };


// User ma'lumotlarini olish
const getAccount = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User found", user });
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(401).json({ message: "Server error" });
  }
};

// User ma'lumotlarini ko'rish
const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json({ message: "User found", user });
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Server error" })
  }
}

// Companiya ma'lumotlarini olish
const getCompany = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const company = await Company.findById(decoded.userId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company found", company });
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(401).json({ message: "Server error" });
  }
};

// Company ma'lumotlarini yangilash
const updateCompany = async (req, res) => {
  const { companyId } = req.params;
  const {
    companyName,
    companyPassword,
    companyEmail,
    companyImage,
    companyPhone,
  } = req.body;

  const image = req.file ? req.file.filename : null;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const hashedPassword = await bcrypt.hash(companyPassword, 10);

    if (companyEmail && companyEmail !== company.companyEmail) {
      const existingEmail = await Company.findOne({ companyEmail });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Company email already exists" });
      }
    }

    company.companyName = companyName || company.companyName;
    company.companyEmail = companyEmail || company.companyEmail;
    company.companyImage = companyImage || company.companyImage;
    company.companyPhone = companyPhone || company.companyPhone;
    company.companyPassword = hashedPassword || company.companyPassword;

    if (image) {
      if (company.photo) {
        const oldImagePath = path.join(__dirname, "../uploads/", company.photo);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      company.photo = image;
    }

    await company.save();

    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Server error" });
  }
};

module.exports = {
  updateUser,
  getAccount,
  getCompany,
  updateCompany, getUser
};
