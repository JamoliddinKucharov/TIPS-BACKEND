const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  updateCompany,
  getCompany,
} = require("../controllers/getUpdateController");
const { check } = require("express-validator");

const router = express.Router();

router.get("/company", getCompany);

// User Update
router.put(
  "/company/:companyId",
  [
    check("companyName", "Username is required").notEmpty(),
    check("companyEmail", "Email is required").notEmpty(),
    check("companyPassword", "Password must be at least 6 characters").isLength(
      {
        min: 6,
      }
    ),
  ],
  updateCompany
);

module.exports = router;
