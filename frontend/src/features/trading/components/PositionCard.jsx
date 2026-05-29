import { formatCurrency, formatPercentage } from "../../../utils/formatters";

const PositionCard = ({ position, onSell }) => {
  const pnlPositive = position.pnl >= 0;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1728] p-5 transition hover:border-emerald-300/50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {position.symbol}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            {position.quantity} shares
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onSell(position)}
          className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Sell
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white/[0.04] p-4">
          <p className="text-xs text-slate-500">Avg price</p>
          <p className="mt-2 font-semibold text-slate-100">
            {formatCurrency(position.avgPriceInCents)}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-4">
          <p className="text-xs text-slate-500">Current price</p>
          <p className="mt-2 font-semibold text-slate-100">
            {formatCurrency(position.currentPriceInCents)}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-4">
          <p className="text-xs text-slate-500">Invested</p>
          <p className="mt-2 font-semibold text-slate-100">
            {formatCurrency(position.invested)}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-4">
          <p className="text-xs text-slate-500">Current value</p>
          <p className="mt-2 font-semibold text-slate-100">
            {formatCurrency(position.currentValue)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-lg bg-white/[0.04] px-4 py-4 text-sm">
        <div>
          <p className="text-slate-500">Profit / Loss</p>
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
