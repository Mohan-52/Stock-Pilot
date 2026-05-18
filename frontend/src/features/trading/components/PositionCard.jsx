import { formatCurrency, formatPercentage } from "../../../utils/formatters";

const PositionCard = ({ position, onSell }) => {
  const pnlPositive = position.pnl >= 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {position.symbol}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            {position.quantity} shares
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onSell(position)}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Sell
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Avg price
          </p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">
            {formatCurrency(position.avgPriceInCents)}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current price
          </p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">
            {formatCurrency(position.currentPriceInCents)}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">Invested</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">
            {formatCurrency(position.invested)}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current value
          </p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">
            {formatCurrency(position.currentValue)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-3xl bg-slate-100 px-4 py-4 text-sm dark:bg-slate-900">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Profit / Loss</p>
          <p
            className={`mt-1 text-lg font-semibold ${pnlPositive ? "text-emerald-500" : "text-red-500"}`}
          >
            {formatCurrency(position.pnl)}
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${pnlPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
        >
          {formatPercentage(position.pnlPercentage)}
        </div>
      </div>
    </div>
  );
};

export default PositionCard;
