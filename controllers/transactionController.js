const Transaction = require('../models/Transaction');

// 🧾 GET: All Transactions (for admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// 🧾 GET: Transactions by userId
exports.getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ Optional: Create transaction (for manual or test purpose)
exports.createTransaction = async (req, res) => {
  const { userId, amount, type, status, currency, note, paymentIntentId } = req.body;

  try {
    const transaction = new Transaction({
      userId,
      amount,
      type,
      status: status || 'pending',
      currency: currency || 'usd',
      note,
      paymentIntentId
    });

    await transaction.save();
    res.status(201).json({ message: "Transaction created", transaction });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ message: "Failed to create transaction", error });
  }
};
