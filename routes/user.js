const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { updateUser, getAccount } = require("../controllers/userController");
const {  check } = require("express-validator");

const router = express.Router();

router.get("/account", getAccount);

// User Update
router.put(
  "/account/:userId",
  [
    check("username", "Username is required").notEmpty(),
    check("email", "Email is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  updateUser
);

module.exports = router;
