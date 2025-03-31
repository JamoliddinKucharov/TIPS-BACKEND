const Rating = require("../models/Rating");

const AddRating = async (req, res) => {
    const { user_id, rater_id, rating } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Reyting 1 dan 5 gacha bo‘lishi kerak" });
    }

    try {
        const existingRating = await Rating.findOne({ user_id, rater_id });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            const newRating = new Rating({ user_id, rater_id, rating });
            await newRating.save();
        }

        return res.json({ message: "Reyting saqlandi" });
    } catch (error) {
        return res.status(500).json({ message: "Server xatosi", error });
    }
};


const getRating = async (req, res) => {
    const { user_id } = req.params;

    try {
        const ratings = await Rating.find({ user_id });

        if (ratings.length === 0) {
            return res.json({ averageRating: 0, totalRatings: 0 });
        }

        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = (sumRatings / totalRatings).toFixed(2);

        return res.json({ averageRating, totalRatings });
    } catch (error) {
        return res.status(500).json({ message: "Server xatosi", error });
    }
}

module.exports = { AddRating, getRating };