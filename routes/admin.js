const express = require("express");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authenticate");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * /superadmin:
 *   get:
 *     summary: Access Superadmin panel
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for Superadmin
 *       403:
 *         description: Forbidden
 */
router.get(
  "/superadmin",
  authMiddleware,
  roleMiddleware("superadmin"),
  (req, res) => {
    res.json({ message: "Welcome, Superadmin!" });
  }
);

/**
 * @swagger
 * /infoadmin:
 *   get:
 *     summary: Access Infoadmin panel
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for Infoadmin
 *       403:
 *         description: Forbidden
 */
router.get(
  "/infoadmin",
  authMiddleware,
  roleMiddleware("infoadmin"),
  (req, res) => {
    res.json({ message: "Welcome, Infoadmin!" });
  }
);

/**
 * @swagger
 * /assign-infoadmin:
 *   post:
 *     summary: Assign a user as Infoadmin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to assign as Infoadmin
 *     responses:
 *       200:
 *         description: User assigned as Infoadmin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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
