import Stripe from "stripe";

// Initialize Stripe with your secret key from Vercel Environment Variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // Hardcoded Price ID for your premium sticker
    const priceId = "price_1S636zBbUM12DkfZhhQWsnB1"; // 👈 Replace with your real Price ID

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://getpoppables.com/success", // 👈 Replace with your success URL
      cancel_url: "https://getpoppables.com/cancel",   // 👈 Replace with your cancel URL
    });

    // Return the URL of the checkout session
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ error: "Something went wrong creating the checkout session" });
  }
}
