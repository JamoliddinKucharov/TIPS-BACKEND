const express = require("express");
const { authMiddleware } = require("../middleware/authenticate");
const User = require("../models/Admin");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Server error" });
  }
});

module.exports = router;
