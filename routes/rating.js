const express = require("express");
const { AddRating, getRating } = require("../controllers/rating");
const router = express.Router();

router.post("/add", AddRating);

router.get("/average-rating/:user_id", getRating);


module.exports = router