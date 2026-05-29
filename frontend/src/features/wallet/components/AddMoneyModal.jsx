import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "../hooks/usePayments";
import { useToast } from "./ToastProvider";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#f8fafc",
      fontSize: "16px",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#f87171" },
  },
};

const AddMoneyModal = ({ isOpen, onClose, onSuccess, minAmount = 1 }) => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const mutation = useCreatePaymentIntent({
    onError: () => {
      setProcessing(false);
      toast.push("error", "Failed to create payment intent");
    },
  });

  const reset = () => {
    setAmount(0);
    setError(null);
    setProcessing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const entered = Number(amount);
    if (Number.isNaN(entered) || entered <= 0) {
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

      if (!stripe) {
        setError("Payment failed - Stripe not ready");
        setProcessing(false);
        return;
      }
      if (!elements || !card) {
        setError("Payment failed - Card element not mounted");
        setProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(String(clientSecret), {
        payment_method: { card },
      });

      if (result.error) {
        setError(result.error.message);
        toast.push("error", result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        toast.push("success", "Payment confirmed. Wallet will update shortly.");
        setProcessing(false);
        reset();
        onSuccess?.();
        onClose?.();
        return;
      }

      setError("Payment not completed");
      setProcessing(false);
    } catch (err) {
      setError(err.message || "Payment failed");
      setProcessing(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#0b1728] p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">Add Money</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-slate-400">Amount (USD)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-emerald-300"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Card</label>
            <div className="mt-1 rounded-lg border border-white/10 bg-white/5 p-3">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {error && <div className="text-sm text-red-300">{error}</div>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose?.();
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
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
