const express = require('express');
const { createReview, getReviewsByFundraising } = require('../controllers/reviewController');

const router = express.Router();

// Yangi otziv qo‘shish
router.post('/', createReview);

// Ma'lum bir fundraising uchun otzivlar ro‘yxatini olish
router.get('/:fundraisingId', getReviewsByFundraising);

module.exports = router;
