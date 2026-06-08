import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RefreshCw, Search, Star } from "lucide-react";
import TradingLayout from "../components/TradingLayout";
import WatchlistButton from "../components/WatchlistButton";
import { fetchWatchlist } from "../api/watchlistAPI";
import { useStockStore } from "../../../contexts/StockStoreContext";
import { getAccessToken } from "../../auth/authService";

const formatPrice = (stock) =>
  stock.price === undefined || stock.price === null
    ? "N/A"
    : `${stock.currency || "USD"} ${Number(stock.price).toFixed(2)}`;

const formatLastUpdated = (timestamp) => {
  if (!timestamp) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
};

const WatchlistPage = () => {
  const navigate = useNavigate();
  const accessToken = getAccessToken();
  const { watchlist, connectionStatus, hydrateWatchlist, setWatchlisted } =
    useStockStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadWatchlist = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextStocks = await fetchWatchlist();
      hydrateWatchlist(nextStocks);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your watchlist. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, hydrateWatchlist, navigate]);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const handleWatchlistChange = useCallback((symbol, nextValue) => {
    setWatchlisted(symbol, nextValue);
  }, [setWatchlisted]);

  const filteredStocks = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return watchlist;
    }

    return watchlist.filter((stock) =>
      [stock.symbol, stock.name, stock.exchange, stock.industry]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search)),
    );
  }, [query, watchlist]);

  const actions = (
    <button
      type="button"
      onClick={loadWatchlist}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
    >
      <RefreshCw className="h-4 w-4" aria-hidden="true" />
      Refresh
    </button>
  );

  return (
    <TradingLayout
      eyebrow="Watchlist"
      title="Saved stocks"
      subtitle="Follow the symbols you care about and keep their prices synced with the live market stream."
      actions={actions}
    >
      <section className="rounded-lg border border-white/10 bg-[#0b1728]">
        <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Your watchlist</h2>
            <p className="mt-1 text-sm capitalize text-slate-400">
              WebSocket {connectionStatus}
            </p>
          </div>
          <label className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search watchlist"
              className="min-h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-lg bg-white/[0.06]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100">
              <p className="font-semibold">Unable to load watchlist</p>
              <p className="mt-2 text-sm">{error}</p>
              <button
                type="button"
                onClick={loadWatchlist}
                className="mt-5 rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Retry
              </button>
            </div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="p-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-amber-300/30 bg-amber-300/10 text-amber-300">
              <Star className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-white">
              No watched stocks yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Add stars from the market screen to build a focused list of live
              prices.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Browse market
            </Link>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">
              No watched stocks match your search.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/stocks/${stock.symbol}`, { state: { stock } })
                    }
                    className="flex min-w-0 items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                  >
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
                        {stock.name || "Company name unavailable"}
                      </p>
                    </div>
                  </button>
                  <WatchlistButton
                    symbol={stock.symbol}
                    watchlisted={Boolean(stock.watchlisted)}
                    onOptimisticChange={handleWatchlistChange}
                    showLabel
                  />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Price
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {formatPrice(stock)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Last Updated
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-200">
                      {formatLastUpdated(stock.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </TradingLayout>
  );
};

export default WatchlistPage;
