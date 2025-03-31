const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rater_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });


RatingSchema.index({ user_id: 1, rater_id: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);
