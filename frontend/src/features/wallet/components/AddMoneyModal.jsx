import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "../hooks/usePayments";
import { useToast } from "./ToastProvider";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1f2937",
      fontSize: "16px",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const AddMoneyModal = ({ isOpen, onClose, onSuccess, minAmount = 1 }) => {
  const stripe = useStripe();
  const elements = useElements();
  // Log stripe/elements so we can detect stale context or re-render issues
  // eslint-disable-next-line no-console
  console.debug("[AddMoneyModal] stripe:", stripe, "elements:", elements);
  const toast = useToast();
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const mutation = useCreatePaymentIntent({
    onError: (err) => {
      setProcessing(false);
      toast.push("error", "Failed to create payment intent");
    },
  });

  const reset = () => {
    setAmount(0);
    setError(null);
    setProcessing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const entered = Number(amount);
    if (isNaN(entered) || entered <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (entered < minAmount) {
      setError(`Minimum amount is ${minAmount}`);
      return;
    }

    setProcessing(true);

    try {
      const res = await mutation.mutateAsync({ amount: entered });

      const clientSecret = res?.clientSecret;

      const card = elements?.getElement(CardElement);
      // eslint-disable-next-line no-console

      if (!stripe) {
        setError("Payment failed - Stripe not ready (stripe missing)");
        setProcessing(false);
        return;
      }
      if (!elements || !card) {
        setError("Payment failed - Card element not mounted");
        setProcessing(false);
        return;
      }

      // Confirm payment with the exact clientSecret from server. Do not modify it.
      const result = await stripe.confirmCardPayment(String(clientSecret), {
        payment_method: { card },
      });

      if (result.error) {
        setError(result.error.message);
        toast.push("error", result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        toast.push("success", "Payment confirmed. Wallet will update shortly.");
        setProcessing(false);
        reset();
        onSuccess && onSuccess();
        onClose && onClose();
        return;
      }

      setError("Payment not completed");
      setProcessing(false);
    } catch (err) {
      setError(err.message || "Payment failed");
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900">Add Money</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Amount ({"USD"})</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-200 bg-gray-50 p-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Card</label>
            <div className="mt-1 p-3 border rounded border-gray-200 bg-white">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose && onClose();
              }}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-black text-white rounded disabled:opacity-60"
            >
              {processing ? "Processing..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyModal;
