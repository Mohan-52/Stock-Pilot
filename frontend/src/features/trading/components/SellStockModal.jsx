import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { useToast } from "../../../components/ToastProvider";
import { useSellOrder } from "../hooks/useSellOrder";
import { formatCurrency } from "../../../utils/formatters";

const SellStockModal = ({ isOpen, onClose, position }) => {
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState("");
  const toast = useToast();
  const { mutateAsync, isPending } = useSellOrder();
  const availableQuantity = position?.quantity ?? 0;

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
            className="block text-sm font-semibold text-white"
          >
            Symbol
          </label>
          <input
            id="sell-symbol"
            value={position.symbol}
            disabled
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="sell-quantity"
              className="block text-sm font-semibold text-white"
            >
              Quantity to sell
            </label>
            <p className="text-sm text-slate-400">
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
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
            disabled={isPending}
          />
        </div>

        <div className="rounded-lg bg-white/[0.04] p-4 text-sm text-slate-300">
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
          disabled={isPending}
          className="inline-flex w-full items-center justify-center rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {isPending ? "Placing sell order..." : "Confirm Sell"}
        </button>
      </form>
    </Modal>
  );
};

export default SellStockModal;
