const express = require("express");
const { authMiddleware } = require("../middleware/authenticate");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: 64b63d37f56d4e001a2d5e3a
 *                     username:
 *                       type: string
 *                       description: Username of the user
 *                       example: johndoe
 *                     role:
 *                       type: string
 *                       description: User role
 *                       example: infoadmin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
