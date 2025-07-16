let stripe;

try {
  const stripeKey = process.env.STRIPE_TEST_SECRET_KEY;
  if (!stripeKey) throw new Error("❌ STRIPE_TEST_SECRET_KEY is missing.");
  stripe = require("stripe")(stripeKey);
} catch (e) {
  console.log("❌ STRIPE INIT ERROR:", e.message);
  module.exports = (req, res) => {
    res.status(500).json({ error: "Stripe init failed: " + e.message });
  };
  return;
}

module.exports = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("❌ STRIPE CREATE ERROR:", error.message);
    res.status(500).json({ error: "PaymentIntent creation failed: " + error.message });
  }
};
