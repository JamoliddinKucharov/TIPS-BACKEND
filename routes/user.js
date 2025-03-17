const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { updateUser, getAccount } = require("../controllers/userController");
const { body } = require("express-validator");

const router = express.Router();

router.get("/account", getAccount);

// User Update
router.put(
  "/account/:userId",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
  ],
  updateUser
);

module.exports = router;
