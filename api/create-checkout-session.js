import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // --- Allow CORS for testing/live domains ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace * with your domain if needed
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // --- Handle preflight request ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // --- GET: Retrieve existing session info ---
  if (req.method === "GET") {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items.data.price.product"],
      });
      return res.status(200).json(session);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve session" });
    }
  }

  // --- POST: Create a new checkout session ---
  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          { price: "price_1S636zBbUM12DkfZhhQWsnB1", quantity: 1 } // Stripe price ID
        ],
        mode: "payment",
        success_url: "https://www.getpoppables.com/success.html?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://www.getpoppables.com/cancel.html?session_id={CHECKOUT_SESSION_ID}"
        // Notice: no payment_method_types or shipping settings — dashboard defaults apply
      });

      return res.status(200).json({ url: session.url });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong creating the checkout session" });
    }
  }

  // --- Method not allowed ---
  return res.status(405).json({ error: "Method not allowed" });
}
