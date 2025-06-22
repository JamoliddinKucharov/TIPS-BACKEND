const express = require("express");
const { check } = require("express-validator");
const passport = require('passport');
const {
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser,
  registerCompany,
  loginCompany,
  getDashboard,
  logout,
  forgotPassword,
  resetPassword,
  googleTokenLogin 
} = require("../controllers/authController");

const router = express.Router();

// Admin Register
router.post(
  "/register",
  [
    check("username", "Username is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
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
    check("email", "Email is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
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
    check("companyPassword", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  registerCompany
);

// Company Login
router.post("/company/login", loginCompany);

// 👉 Forgot & Reset Password (YANGI)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// 🔐 Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.post("/google/token-login", googleTokenLogin);


// 🔐 Facebook Login
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Dashboard & Logout
router.get('/dashboard', getDashboard);
router.get('/logout', logout);

module.exports = router;
