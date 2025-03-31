const express = require("express");
const { check } = require("express-validator");
const { senderRegister, senderLogin, senderGet, senderUpdate } = require("../controllers/sender");
const router = express.Router();


// Sender Register  
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
    senderRegister
);


router.post("/login", senderLogin);

router.get("/account", senderGet);
router.put("/:senderId", senderUpdate);

module.exports = router;
