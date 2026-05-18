import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BuyStockModal from "../components/BuyStockModal";
import SellStockModal from "../components/SellStockModal";
import PositionTable from "../components/PositionTable";
import PositionCard from "../components/PositionCard";
import { usePortfolioPositions } from "../hooks/usePortfolioPositions";
import { formatCurrency } from "../../../utils/formatters";

const PortfolioPositionsPage = () => {
  const [page, setPage] = useState(0);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [sellSelection, setSellSelection] = useState(null);

  const { data, isLoading, isError, error, refetch } =
    usePortfolioPositions(page);
  const positions = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const portfolioStats = useMemo(() => {
    const invested = positions.reduce(
      (sum, position) => sum + (position.invested ?? 0),
      0,
    );
    const currentValue = positions.reduce(
      (sum, position) => sum + (position.currentValue ?? 0),
      0,
    );
    const pnl = positions.reduce(
      (sum, position) => sum + (position.pnl ?? 0),
      0,
    );

    return { invested, currentValue, pnl };
  }, [positions]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="border-b border-slate-200 bg-white py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Portfolio
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              Your positions
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Track holdings, manage orders, and keep your portfolio aligned
              with the market.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsBuyOpen(true)}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Buy stocks
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              Refresh
            </button>
            <Link
              to="/dashboard"
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Portfolio summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  Position health
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Invested
                  </p>
                  <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(portfolioStats.invested)}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Current value
                  </p>
                  <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(portfolioStats.currentValue)}
                  </p>
                </div>
                <div
                  className={`rounded-3xl p-4 ${portfolioStats.pnl >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"} dark:bg-slate-950`}
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Unrealized P/L
                  </p>
                  <p className="mt-3 text-xl font-semibold">
                    {formatCurrency(portfolioStats.pnl)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {page + 1} of {totalPages}
                </h2>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={page <= 0}
                  onClick={() => setPage((current) => Math.max(current - 1, 0))}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() =>
                    setPage((current) => Math.min(current + 1, totalPages - 1))
                  }
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-slate-900 dark:border-red-700 dark:bg-red-950 dark:text-white">
              <h3 className="text-xl font-semibold">
                Unable to load positions
              </h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {error?.message ?? "Please try again in a moment."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Retry
              </button>
            </div>
          ) : positions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No holdings yet
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                Your portfolio is empty
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-sm text-slate-600 dark:text-slate-400">
                Start building your portfolio by buying stocks. Your positions
                will appear here with performance, P/L, and available sell
                actions.
              </p>
              <button
                type="button"
                onClick={() => setIsBuyOpen(true)}
                className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Buy your first stock
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <PositionTable positions={positions} onSell={setSellSelection} />
              <div className="grid gap-4 sm:grid-cols-2">
                {positions.map((position) => (
                  <PositionCard
                    key={position.symbol}
                    position={position}
                    onSell={setSellSelection}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <BuyStockModal isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <SellStockModal
        isOpen={Boolean(sellSelection)}
        onClose={() => setSellSelection(null)}
        position={sellSelection}
      />
    </div>
  );
};

export default PortfolioPositionsPage;
