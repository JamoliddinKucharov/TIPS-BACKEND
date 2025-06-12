const Stripe = require('stripe');
const Transaction = require('../models/Transaction');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 💳 Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount value' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { userId }
    });

    await Transaction.create({
      userId,
      amount,
      currency: 'usd',
      status: 'pending',
      paymentIntentId: paymentIntent.id
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// 💳 Withdraw to card
exports.withdrawToCard = async (req, res) => {
  const { userId, amount, role } = req.body;

  if (!userId || !amount || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let entity;
    if (role === 'user') {
      const User = require('../models/User');
      entity = await User.findById(userId);
    } else if (role === 'fundraising') {
      const Fundraising = require('../models/Fundraising');
      entity = await Fundraising.findById(userId);
    }

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    const stripeResponse = { success: true, message: 'Withdrawal initiated' };

    await Transaction.create({
      userId,
      amount,
      status: 'pending',
      currency: 'usd',
      note: `Withdraw initiated by ${role}`
    });

    res.status(200).json(stripeResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
