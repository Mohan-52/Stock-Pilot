import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
// Basic env validation and helpful debug info
if (!key) {
  console.error(
    "[stripe] VITE_STRIPE_PUBLISHABLE_KEY is not set. Check your .env and restart Vite.",
  );
  throw new Error(
    "Stripe publishable key missing. Set VITE_STRIPE_PUBLISHABLE_KEY in your .env file",
  );
}

// Log the value loaded at build/runtime so devs can detect stale env/cache issues.
try {
  if (String(key).startsWith("pk_live")) {
    console.warn(
      "[stripe] Using a live publishable key (pk_live). Ensure this is intended.",
    );
  }
} catch (e) {
  // ignore logging errors
}

export const stripePromise = loadStripe(key);

// Log resolved Stripe instance to make sure loadStripe succeeded and wasn't nil.
stripePromise
  .then((stripe) => {
    if (!stripe) {
      console.error(
        "[stripe] loadStripe resolved to null — check publishable key and network.",
      );
    } else {
      console.debug("[stripe] stripe instance initialized", stripe);
    }
  })
  .catch((err) => {
    console.error("[stripe] loadStripe failed:", err);
  });

export default stripePromise;
