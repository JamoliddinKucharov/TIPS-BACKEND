const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  updateUser,
  getAccount,
  getAllUsers,
  getUser
} = require("../controllers/getUpdateController");
const { check } = require("express-validator");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/account", getAccount);

router.get("/accounts", getAllUsers);

router.get("/:userId", getUser)

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

  upload.single("image"),
  updateUser
);

module.exports = router;
