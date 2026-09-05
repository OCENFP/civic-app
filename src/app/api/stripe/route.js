import { stripe } from "../../../lib/stripe";
import { withErrorHandling } from "../../../lib/errorHandler";

// Resolve the site's base URL from the request instead of hardcoding
// localhost, so success/cancel redirects work in every environment.
function baseUrl(req) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000"
  );
}

export const POST = withErrorHandling(async (req) => {
  const origin = baseUrl(req);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Pro Access" },
          unit_amount: 999,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
  });

  return Response.json({ url: session.url });
});
