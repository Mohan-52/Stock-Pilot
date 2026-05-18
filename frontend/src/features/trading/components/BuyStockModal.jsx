import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { useToast } from "../../../components/ToastProvider";
import { useBuyOrder } from "../hooks/useBuyOrder";
import { formatCurrency } from "../../../utils/formatters";

const BuyStockModal = ({ isOpen, onClose }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState("");
  const toast = useToast();
  const { mutateAsync, isLoading } = useBuyOrder();

  useEffect(() => {
    if (isOpen) {
      setSymbol("");
      setQuantity(1);
      setFormError("");
    }
  }, [isOpen]);

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
            className="block text-sm font-semibold text-slate-900 dark:text-white"
          >
            Stock symbol
          </label>
          <input
            id="buy-symbol"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            placeholder="AAPL"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="buy-quantity"
              className="block text-sm font-semibold text-slate-900 dark:text-white"
            >
              Quantity
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Market price is determined at order execution.
            </p>
          </div>
          <input
            id="buy-quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            disabled={isLoading}
          />
        </div>

        {formError && <p className="text-sm text-red-500">{formError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoading ? "Placing order..." : "Place Buy Order"}
        </button>
      </form>
    </Modal>
  );
};

export default BuyStockModal;
