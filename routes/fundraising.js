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
const { withdrawToCard } = require("../controllers/stripeController");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * 📌 Fundraising ID orqali profil bilan birga ma'lumot olish (user bo'lmasa ham ishlaydi)
 * GET /api/auth/fundraising/details/:id
 */
router.get('/details/:id', async (req, res) => {
  try {
    const fundraising = await Fundraising.findById(req.params.id).lean();

    if (!fundraising) {
      return res.status(404).json({ message: "Fundraising not found" });
    }

    let user = null;
    if (fundraising.userId) {
      user = await User.findById(fundraising.userId).lean();
    } 

    res.json({ fundraising, user });
  } catch (err) {
    console.error("Fundraising details error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 👤 Fundraising Ro‘yxatdan o‘tish
 * POST /api/auth/fundraising/register
 */
router.post( 
  "/register",
  upload.single("photo"), // ✅ rasm yuklash qo‘shildi
  [
    check("username", "Username is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 })
  ],
  fundraisingRegister
);

/**
 * 🔐 Fundraising Login
 * POST /api/auth/fundraising/login
 */
router.post("/login", fundraisingLogin);

/**
 * 🧾 Profilni olish
 * GET /api/auth/fundraising/account
 */
router.get("/account", fundraisingGet);

/**
 * ✏️ Fundraising ma’lumot yangilash (rasm bilan)
 * PUT /api/auth/fundraising/:fundraisingId
 */
router.put(
  "/:fundraisingId",
  upload.single("photo"), // ✅ yangilash uchun ham rasm qabul qilinadi
  fundraisingUpdate
);

/**
 * 🏦 Pulni kartaga yechish
 * POST /api/auth/fundraising/withdraw
 */
router.post("/withdraw", withdrawToCard);

module.exports = router;
