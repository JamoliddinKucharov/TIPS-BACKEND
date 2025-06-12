const express = require('express');
const router = express.Router();
const { getAllTransactions } = require('../controllers/transactionController');

// 📍GET: List all transactions
router.get('/', getAllTransactions);

module.exports = router;
