const Stripe = require('stripe');
const Transaction = require('../models/Transaction');


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    // Tekshiruv
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount value' });
    }

    console.log("Stripe secret:", process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollardan centga
      currency: 'usd',
      metadata: { userId }
    });

    const transaction = new Transaction({
      userId,
      amount,
      currency: 'usd',
      status: 'pending',
      paymentIntentId: paymentIntent.id
    });

    await transaction.save();

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error('Stripe error', err);
    res.status(500).send({ error: err.message });
  }
};
