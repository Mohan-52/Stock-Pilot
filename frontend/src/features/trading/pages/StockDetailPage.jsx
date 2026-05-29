import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import apiClient from "../../../services/apiClient";
import BuyStockModal from "../components/BuyStockModal";
import TradingLayout from "../components/TradingLayout";
import { useLiveStockUpdates } from "../hooks/useLiveStockUpdates";
import { formatCurrency } from "../../../utils/formatters";

const StockDetailPage = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateStock = location.state?.stock;

  const [stock, setStock] = useState(stateStock ?? null);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!stateStock);
  const [error, setError] = useState("");

  const mergeLiveUpdate = useCallback(
    (update) => {
      if (!update?.symbol || update.symbol !== symbol) {
        return;
      }

      setStock((previous) => ({
        ...(previous ?? {}),
        ...update,
        previousPrice: previous?.price,
        lastUpdatedAt: update.timestamp || Date.now(),
      }));
      console.debug("[stocks:detail] State updated", update.symbol);
    },
    [symbol],
  );

  const connectionStatus = useLiveStockUpdates({
    enabled: Boolean(symbol),
    onStockUpdate: mergeLiveUpdate,
  });

  useEffect(() => {
    if (!symbol) {
      return;
    }

    if (stateStock) {
      setStock(stateStock);
      setIsLoading(false);
      return;
    }

    const fetchStock = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await apiClient.get(`/stocks/${symbol}`);
        setStock(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load stock details. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [symbol, stateStock]);

  if (!symbol) {
    return (
      <TradingLayout title="Invalid stock" subtitle="No stock symbol was provided.">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <Link
            to="/dashboard"
            className="inline-flex min-h-11 items-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950"
          >
            Return to dashboard
          </Link>
        </div>
      </TradingLayout>
    );
  }

  const actions = (
    <button
      type="button"
      onClick={() => setIsBuyOpen(true)}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
    >
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      Buy {symbol.toUpperCase()}
    </button>
  );

  return (
    <TradingLayout
      eyebrow="Stock detail"
      title={`${symbol.toUpperCase()} details`}
      subtitle="Inspect company metadata and keep the current quote synced with the live market stream."
      actions={actions}
    >
      <Link
        to="/dashboard"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      <section className="rounded-lg border border-white/10 bg-[#0b1728] p-4 sm:p-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-lg bg-white/[0.06]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-red-100">
            <p className="text-lg font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-5 rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              Return to dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Symbol
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {stock.symbol}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {stock.name || "Stock details"}
                </p>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Current price
                </p>
                <p className="mt-3 text-3xl font-semibold text-emerald-300">
                  {stock.currency || "USD"}{" "}
                  {stock.price === undefined ? "N/A" : Number(stock.price).toFixed(2)}
                </p>
                <p className="mt-2 text-sm capitalize text-slate-400">
                  WebSocket {connectionStatus}
                </p>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Exchange
                </p>
                <p className="mt-3 text-xl font-semibold text-white">
                  {stock.exchange || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white/[0.04] p-5">
                <p className="text-sm text-slate-400">Industry</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {stock.industry || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-5">
                <p className="text-sm text-slate-400">Market cap</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {stock.marketCap ? formatCurrency(stock.marketCap) : "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-5">
                <p className="text-sm text-slate-400">Website</p>
                {stock.websiteUrl ? (
                  <a
                    href={stock.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex break-all text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    Visit company site
                  </a>
                ) : (
                  <p className="mt-2 text-lg font-semibold text-white">N/A</p>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white/[0.04] p-5">
              <h2 className="text-xl font-semibold text-white">
                About {stock.symbol}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {stock.description ||
                  "No additional description is available for this stock."}
              </p>
            </div>
          </div>
        )}
      </section>

      <BuyStockModal
        isOpen={isBuyOpen}
        onClose={() => setIsBuyOpen(false)}
        initialSymbol={stock?.symbol ?? symbol}
      />
    </TradingLayout>
  );
};

export default StockDetailPage;
