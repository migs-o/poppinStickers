import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1S636zBbUM12DkfZhhQWsnB1", // 👈 replace with your real Price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://poppin-stickers.vercel.app/success",
      cancel_url: "https://poppin-stickers.vercel.app/cancel",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

