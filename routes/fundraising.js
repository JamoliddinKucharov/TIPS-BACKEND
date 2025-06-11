const express = require("express");
const { check } = require("express-validator");
const {
  fundraisingRegister,
  fundraisingLogin,
  fundraisingGet,
  fundraisingUpdate
} = require("../controllers/fundraising");
const Fundraising = require("../models/Fundraising");
const User = require("../models/User");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * 📌 Fundraising ID orqali profil bilan birga ma'lumot olish
 * GET /api/fundraising/details/:id
 */
router.get('/details/:id', async (req, res) => {
  try {
    const fundraising = await Fundraising.findById(req.params.id).lean();

    if (!fundraising) {
      return res.status(404).json({ message: "Fundraising not found" });
    }

    // ❗️Agar fundraising hujjatida `userId` yo‘q bo‘lsa, bu qism xatolik beradi.
    if (!fundraising.userId) {
      return res.status(400).json({ message: "No userId associated with this fundraising record" });
    }

    const user = await User.findById(fundraising.userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ fundraising, user });
  } catch (err) {
    console.error("Fundraising details error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 👤 Fundraising Ro‘yxatdan o‘tish
 * POST /api/fundraising/register
 */
router.post(
  "/register",
  [
    check("username", "Username is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 })
  ],
  fundraisingRegister
);

/**
 * 🔐 Fundraising Login
 * POST /api/fundraising/login
 */
router.post("/login", fundraisingLogin);

/**
 * 🧾 Profilni olish
 * GET /api/fundraising/account
 */
router.get("/account", fundraisingGet);

/**
 * ✏️ Fundraising ma’lumot yangilash (rasm bilan)
 * PUT /api/fundraising/:fundraisingId
 */
router.put("/:fundraisingId", upload.single("image"), fundraisingUpdate);

module.exports = router;
