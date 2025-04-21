const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  updateCompany,
  getCompany,
} = require("../controllers/getUpdateController");
const { check } = require("express-validator");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/company", getCompany);

// User Update
router.put(
  "/company/:companyId",
  [
    check("companyName", "Username is required").notEmpty(),
    check("companyEmail", "Email is required").notEmpty(),

  ],
  upload.single("image"),
  updateCompany
);

module.exports = router;
