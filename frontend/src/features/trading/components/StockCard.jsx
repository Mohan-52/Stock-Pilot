import { TrendingDown, TrendingUp } from "lucide-react";
import WatchlistButton from "./WatchlistButton";

const formatPrice = (stock) =>
  stock.price === undefined || stock.price === null
    ? "N/A"
    : `${stock.currency || "USD"} ${Number(stock.price).toFixed(2)}`;

const StockCard = ({ stock, onOpen, onWatchlistChange }) => {
  const isUp =
    stock.previousPrice === undefined || stock.price >= stock.previousPrice;

  return (
    <button
      type="button"
      onClick={() => onOpen?.(stock)}
      className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {stock.logoUrl ? (
            <img
              src={stock.logoUrl}
              alt={`${stock.symbol} logo`}
              className="h-11 w-11 rounded-lg bg-white object-contain p-1"
            />
          ) : (
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-800 text-sm font-bold text-slate-200">
              {stock.symbol?.slice(0, 2) || "?"}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-white">
              {stock.symbol}
            </p>
            <p className="truncate text-sm text-slate-400">
              {stock.name || stock.exchange || "Market symbol"}
            </p>
          </div>
        </div>
        <WatchlistButton
          symbol={stock.symbol}
          watchlisted={Boolean(stock.watchlisted)}
          onOptimisticChange={onWatchlistChange}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            isUp
              ? "bg-emerald-400/15 text-emerald-300"
              : "bg-red-400/15 text-red-300"
          }`}
        >
          {isUp ? (
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Live
        </span>
        <p className="truncate text-sm text-slate-400">
          {stock.industry || "Industry unavailable"}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Price
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatPrice(stock)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Exchange
          </p>
          <p className="mt-2 truncate text-sm font-semibold text-slate-200">
            {stock.exchange || "N/A"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default StockCard;
