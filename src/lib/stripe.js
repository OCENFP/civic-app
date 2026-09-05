import Stripe from "stripe";

let client;

// Lazy init so builds don't require STRIPE_SECRET_KEY
export function getStripe() {
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return client;
}

export const stripe = new Proxy(
  {},
  {
    get(_target, prop) {
      const value = getStripe()[prop];
      return typeof value === "function" ? value.bind(getStripe()) : value;
    },
  }
);
