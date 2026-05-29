import { useWallet } from "../hooks/useWallet";
import SkeletonLoader from "./SkeletonLoader";

const formatCurrency = (amount, currency = "USD") => {
  const value = amount / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
};

const WalletCard = ({ onAddMoney }) => {
  const { data, isLoading, error } = useWallet();

  return (
    <div className="w-full rounded-lg border border-white/10 bg-[#0b1728] p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm text-slate-400">Available balance</div>
          <div className="mt-2 text-3xl font-semibold text-white">
            {isLoading ? (
              <SkeletonLoader className="h-8 w-40" />
            ) : error ? (
              <div className="text-red-300">Failed to load</div>
            ) : (
              <div>{formatCurrency(data.balance, data.currency)}</div>
            )}
          </div>
          {!isLoading && !error && (
            <div className="mt-1 text-sm text-slate-400">
              Currency: {data.currency}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onAddMoney}
            className="min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
