const Stripe = require('stripe');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Fundraising = require('../models/Fundraising');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 💳 Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount value' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'usd',
      metadata: { userId },
    });

    await Transaction.create({
      userId,
      amount,
      currency: 'usd',
      status: 'pending',
      paymentIntentId: paymentIntent.id,
      type: 'payment',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err.message);
    res.status(500).json({ error: 'Stripe error: ' + err.message });
  }
};


// 💳 Withdraw to Card
exports.withdrawToCard = async (req, res) => {
  const { userId, amount, role } = req.body;

  if (!userId || !amount || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let entity;
    if (role === 'user') {
      entity = await User.findById(userId);
    } else if (role === 'fundraising') {
      entity = await Fundraising.findById(userId);
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    // ⚠️ Real Stripe payout only works with connected accounts
    // This is a placeholder for real payout logic
    // You can enable this when using Stripe Connect:

    /*
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      method: 'standard',
    });
    */

    // For now, just simulate a withdrawal log:
    const transaction = await Transaction.create({
      userId,
      amount,
      currency: 'usd',
      status: 'success', // or 'pending'
      type: 'withdrawal',
      note: `Withdraw initiated by ${role}`,
    });

    res.status(200).json({
      success: true,
      message: 'Withdrawal simulated successfully (not real)',
      transactionId: transaction._id,
    });
  } catch (err) {
    console.error('Withdraw error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};
