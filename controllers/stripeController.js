const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15', // versiyani aniqlab qo‘yish yaxshiroq
});

const Transaction = require('../models/Transaction');

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    console.log("Stripe secret key (for debug):", process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe ishlatadigan birlik — cents
      currency: 'usd',
      metadata: { userId: String(userId) }
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
    console.error('Stripe error:', err);
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  createPaymentIntent
};
