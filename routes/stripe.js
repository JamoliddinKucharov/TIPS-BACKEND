const express = require('express');
const router = express.Router();

const {
  createPaymentIntent,
  withdrawToCard
} = require('../controllers/stripeController');

// 💳 Create payment intent
router.post('/create-payment-intent', createPaymentIntent);

// 💳 Withdraw money
router.post('/withdraw', withdrawToCard);

module.exports = router;
 