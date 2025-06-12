const Transaction = require('../models/Transaction');

// 🧾 GET: All Transactions (admin or system use)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// 🧾 GET: Transactions by User ID
exports.getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
