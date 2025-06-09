const express = require('express');
const {
  createReview,
  getReviewsByFundraising,
  getReviewsByUser
} = require('../controllers/reviewController');

const router = express.Router();

// Yangi otziv qo‘shish
router.post('/', createReview);

// Ma'lum bir fundraising uchun otzivlar ro‘yxatini olish
router.get('/:fundraisingId', getReviewsByFundraising);

// Ma’lum bir user tomonidan yozilgan barcha otzivlar
router.get('/user/:userId', getReviewsByUser);

module.exports = router;
