// routes/transaction.js

const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getTransactionsByUserId
} = require('../controllers/transactionController');

// Hamma tranzaksiyalar
router.get('/', getAllTransactions);

// Faqat bitta userga tegishlilari
router.get('/user/:userId', getTransactionsByUserId);

module.exports = router;
