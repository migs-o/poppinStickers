import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // or your specific domain
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // handle preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        { price: "price_1S636zBbUM12DkfZhhQWsnB1", quantity: 1 } // replace with your price ID
      ],
      mode: "payment",
      success_url: "https://www.getpoppables.com/success", // 👈 Replace with your success URL
      cancel_url: "https://www.getpoppables.com/cancel",   // 👈 Replace with your cancel URL
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong creating the checkout session" });
  }
}
