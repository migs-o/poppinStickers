import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId } = req.body; // 👈 read priceId from request body
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1, // fixed quantity for premium sticker
        },
      ],
      mode: "payment",
      success_url: "https://poppin-stickers.vercel.app/success",
      cancel_url: "https://poppin-stickers.vercel.app/cancel",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ error: "Something went wrong creating the checkout session" });
  }
}
