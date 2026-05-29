import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { useToast } from "../../../components/ToastProvider";
import { useBuyOrder } from "../hooks/useBuyOrder";

const BuyStockModal = ({ isOpen, onClose, initialSymbol = "" }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState("");
  const toast = useToast();
  const { mutateAsync, isPending } = useBuyOrder();

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSymbol(initialSymbol);
      setQuantity(1);
      setFormError("");
    }
  }, [isOpen, initialSymbol]);

  const validate = () => {
    if (!symbol.trim()) {
      return "Please enter a stock symbol.";
    }
    if (quantity <= 0) {
      return "Quantity must be greater than zero.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validate();

    if (validation) {
      setFormError(validation);
      return;
    }

    try {
      await mutateAsync({ symbol: symbol.trim().toUpperCase(), quantity });
      toast.push(
        "success",
        `Buy order for ${symbol.trim().toUpperCase()} placed successfully.`,
      );
      onClose();
    } catch (error) {
      const message = error?.message || "Unable to place buy order.";
      setFormError(message);
      toast.push("error", message);
    }
  };

  return (
    <Modal title="Buy Stock" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="buy-symbol"
            className="block text-sm font-semibold text-white"
          >
            Stock symbol
          </label>
          <input
            id="buy-symbol"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            placeholder="AAPL"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="buy-quantity"
              className="block text-sm font-semibold text-white"
            >
              Quantity
            </label>
            <p className="text-sm text-slate-400">
              Market price is determined at order execution.
            </p>
          </div>
          <input
            id="buy-quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
            disabled={isPending}
          />
        </div>

        {formError && <p className="text-sm text-red-500">{formError}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
        >
          {isPending ? "Placing order..." : "Place Buy Order"}
        </button>
      </form>
    </Modal>
  );
};

export default BuyStockModal;
