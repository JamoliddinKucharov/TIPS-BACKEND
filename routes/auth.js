const express = require("express");
const { check } = require("express-validator");
const {
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser,
  registerCompany,
  loginCompany,
} = require("../controllers/authController");

const router = express.Router();

// Admin Register
router.post(
  "/register",
  [
    check("username", "Username is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  registerAdmin
);

// Admin Login
router.post("/login", loginAdmin);

// User Register
router.post(
  "/user/register",
  [
    check("username", "Username is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

// User Login
router.post("/user/login", loginUser);

// Company Register
router.post(
  "/company/register",
  [
    check("companyName", "companyName is required").notEmpty(),
    check("companyPassword", "Password must be at least 6 characters").isLength(
      {
        min: 6,
      }
    ),
  ],
  registerCompany
);

// Company Login
router.post("/company/login", loginCompany);

module.exports = router;
