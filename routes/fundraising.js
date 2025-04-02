const express = require("express");
const { check } = require("express-validator");
const { fundraisingRegister, fundraisingLogin, fundraisingGet, fundraisingUpdate } = require("../controllers/fundraising");
const upload = require("../middleware/upload");
const router = express.Router();


// Fundraising Register  
router.post(
    "/register",
    [
        check("username", "username is required").notEmpty(),
        check("password", "Password must be at least 6 characters").isLength(
            {
                min: 6,
            }
        ),
    ],
    fundraisingRegister
);


router.post("/login", fundraisingLogin);

router.get("/account", fundraisingGet);
router.put("/:fundraisingId", upload.single("image"), fundraisingUpdate);

module.exports = router;
