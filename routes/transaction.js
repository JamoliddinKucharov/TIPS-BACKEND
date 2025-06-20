const express = require('express');
const router = express.Router();

const {
  getAllTransactions,
  getTransactionsByUserId,
  createTransaction
} = require('../controllers/transactionController');

// 🔐 GET all transactions — Admin or system use
router.get('/', getAllTransactions);

// 👤 GET user transactions by userId
router.get('/user/:userId', getTransactionsByUserId);

// ➕ POST: Create transaction (optional)
router.post('/', createTransaction);

module.exports = router;
