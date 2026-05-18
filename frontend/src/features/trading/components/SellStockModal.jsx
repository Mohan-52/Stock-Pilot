import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { useToast } from "../../../components/ToastProvider";
import { useSellOrder } from "../hooks/useSellOrder";
import { formatCurrency } from "../../../utils/formatters";

const SellStockModal = ({ isOpen, onClose, position }) => {
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState("");
  const toast = useToast();
  const { mutateAsync, isLoading } = useSellOrder();
  const availableQuantity = position?.quantity ?? 0;

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setFormError("");
    }
  }, [isOpen, position]);

  const validate = () => {
    if (!position?.symbol) {
      return "No symbol available to sell.";
    }
    if (quantity <= 0) {
      return "Quantity must be greater than zero.";
    }
    if (quantity > availableQuantity) {
      return "You cannot sell more than the quantity you own.";
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
      await mutateAsync({ symbol: position.symbol, quantity });
      toast.push("success", `Sold ${quantity} shares of ${position.symbol}.`);
      onClose();
    } catch (error) {
      const message = error?.message || "Unable to place sell order.";
      setFormError(message);
      toast.push("error", message);
    }
  };

  if (!position) {
    return null;
  }

  return (
    <Modal title="Sell Stock" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="sell-symbol"
            className="block text-sm font-semibold text-slate-900 dark:text-white"
          >
            Symbol
          </label>
          <input
            id="sell-symbol"
            value={position.symbol}
            disabled
            className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="sell-quantity"
              className="block text-sm font-semibold text-slate-900 dark:text-white"
            >
              Quantity to sell
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Remaining after sale: {availableQuantity - quantity}
            </p>
          </div>
          <input
            id="sell-quantity"
            type="number"
            min="1"
            max={availableQuantity}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            disabled={isLoading}
          />
        </div>

        <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p>
            Owned: <span className="font-semibold">{availableQuantity}</span>
          </p>
          <p>
            Estimated sale proceeds:{" "}
            <span className="font-semibold">
              {formatCurrency(quantity * 100)}
            </span>
          </p>
        </div>

        {formError && <p className="text-sm text-red-500">{formError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          {isLoading ? "Placing sell order..." : "Confirm Sell"}
        </button>
      </form>
    </Modal>
  );
};

export default SellStockModal;
