const Review = require('../models/review');

exports.createReview = async (req, res) => {
  try {
    const { userId, fundraisingId, comment, rating } = req.body;

    const review = new Review({ userId, fundraisingId, comment, rating });
    await review.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

exports.getReviewsByFundraising = async (req, res) => {
  try {
    const { fundraisingId } = req.params;

    const reviews = await Review.find({ fundraisingId })
      .populate('userId', 'username firstName lastName') // foydalanuvchi haqida ko‘rsatish
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};
