const express = require("express");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authenticate");
const User = require("../models/Admin");

const router = express.Router();

router.get(
  "/superadmin",
  authMiddleware,
  roleMiddleware("superadmin"),
  (req, res) => {
    res.json({ message: "Welcome, Superadmin!" });
  }
);
router.get(
  "/infoadmin",
  authMiddleware,
  roleMiddleware("infoadmin"),
  (req, res) => {
    res.json({ message: "Welcome, Infoadmin!" });
  }
);

router.post(
  "/assign-infoadmin",
  authMiddleware,
  roleMiddleware("superadmin"),
  async (req, res) => {
    const { userId } = req.body;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = "infoadmin";
      await user.save();

      res.json({ message: "User assigned as Infoadmin" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
