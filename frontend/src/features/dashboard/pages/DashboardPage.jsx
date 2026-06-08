import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, RefreshCw, Search, TrendingUp } from "lucide-react";
import { getAccessToken, clearAuth } from "../../auth/authService";
import { useUser } from "../../../contexts/UserContext";
import { useStockStore } from "../../../contexts/StockStoreContext";
import apiClient from "../../../services/apiClient";
import TradingLayout from "../../trading/components/TradingLayout";
import StockCard from "../../trading/components/StockCard";
import { normalizeStockList } from "../../trading/utils/stockUpdates";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { stocks, connectionStatus, hydrateStocks, setWatchlisted } =
    useStockStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const accessToken = getAccessToken();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  const fetchStocks = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/stocks");
      hydrateStocks(normalizeStockList(response.data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load stock data. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, hydrateStocks]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const filteredStocks = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return stocks;
    }

    return stocks.filter((stock) => {
      return [stock.symbol, stock.name, stock.exchange, stock.industry]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search));
    });
  }, [query, stocks]);

  const marketStats = useMemo(() => {
    const pricedStocks = stocks.filter((stock) => Number.isFinite(stock.price));
    const gainers = pricedStocks.filter(
      (stock) => stock.previousPrice !== undefined && stock.price >= stock.previousPrice,
    ).length;

    return {
      symbols: stocks.length,
      gainers,
      movers: Math.max(pricedStocks.length - gainers, 0),
    };
  }, [stocks]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    navigate("/login");
  };

  const handleWatchlistChange = useCallback((symbol, nextValue) => {
    setWatchlisted(symbol, nextValue);
  }, [setWatchlisted]);

  if (!accessToken) {
    return null;
  }

  const actions = (
    <>
      <button
        type="button"
        onClick={fetchStocks}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Refresh
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setProfileMenuOpen((prev) => !prev)}
          className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.fullName || "User avatar"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">
              {getInitials(user?.fullName)}
            </span>
          )}
          <span className="hidden sm:inline">{user?.fullName || "User"}</span>
        </button>

        {profileMenuOpen && (
          <div className="absolute right-0 z-40 mt-3 w-72 rounded-lg border border-white/10 bg-[#0d1b2d] p-4 shadow-2xl">
            <p className="text-sm font-semibold text-white">
              {user?.fullName || "User"}
            </p>
            <p className="mt-1 break-all text-sm text-slate-400">{user?.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <TradingLayout
      eyebrow="Live market"
      title="Market watchlist"
      subtitle="Track real-time prices, inspect symbols, and place simulated trades from a focused trading dashboard."
      actions={actions}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">Symbols tracked</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {isLoading ? "--" : marketStats.symbols}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">Price ticks up</p>
          <p className="mt-3 flex items-center gap-2 text-3xl font-semibold text-emerald-300">
            <TrendingUp className="h-6 w-6" aria-hidden="true" />
            {marketStats.gainers}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">WebSocket</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold capitalize text-slate-100">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-emerald-300"
                  : connectionStatus === "connecting"
                    ? "bg-amber-300"
                    : "bg-red-400"
              }`}
            />
            {connectionStatus}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-[#0b1728]">
        <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Stocks</h2>
            <p className="mt-1 text-sm text-slate-400">
              Live ticks merge into the list without refreshing the page.
            </p>
          </div>
          <label className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stocks"
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
              <p className="font-semibold">Unable to load stocks</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">No matching stocks found.</p>
          </div>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onOpen={(selectedStock) =>
                  navigate(`/stocks/${selectedStock.symbol}`, {
                    state: { stock: selectedStock },
                  })
                }
                onWatchlistChange={handleWatchlistChange}
              />
            ))}
          </div>
        )}
      </section>
    </TradingLayout>
  );
};

export default DashboardPage;
