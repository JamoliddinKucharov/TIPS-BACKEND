import Stripe from 'stripe';
import Transaction from '../models/Transaction.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    console.log("Stripe secret:", process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // USD → cents
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
