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

// 📌 Yangi: Fundraising ID orqali profil bilan birga ma'lumot olish
router.get('/details/:id', async (req, res) => {
  try {
    const fundraising = await Fundraising.findById(req.params.id).lean();
    if (!fundraising) {
      return res.status(404).json({ message: "Fundraising not found" });
    }

    const user = await User.findById(fundraising.userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ fundraising, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👤 Ro‘yxatdan o‘tish
router.post(
  "/register",
  [
    check("username", "username is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  fundraisingRegister
);

// 🔐 Login
router.post("/login", fundraisingLogin);

// 🧾 Profilni olish
router.get("/account", fundraisingGet);

// ✏️ Ma’lumot yangilash (rasm bilan)
router.put("/:fundraisingId", upload.single("image"), fundraisingUpdate);

module.exports = router;
