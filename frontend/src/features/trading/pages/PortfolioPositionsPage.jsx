import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import SellStockModal from "../components/SellStockModal";
import PositionTable from "../components/PositionTable";
import PositionCard from "../components/PositionCard";
import PortfolioTrades from "../components/PortfolioTrades";
import TradingLayout from "../components/TradingLayout";
import { usePortfolioPositions } from "../hooks/usePortfolioPositions";
import { usePortfolioStats } from "../hooks/usePortfolioStats";
import { formatCurrency } from "../../../utils/formatters";

const StatTile = ({ label, value, loading, tone = "neutral" }) => {
  const toneClass =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
        ? "text-red-300"
        : "text-white";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      {loading ? (
        <div className="mt-4 h-7 w-32 animate-pulse rounded bg-white/10" />
      ) : (
        <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>{value}</p>
      )}
    </div>
  );
};

const PortfolioPositionsPage = () => {
  const [page, setPage] = useState(0);
  const [sellSelection, setSellSelection] = useState(null);

  const { data, isLoading, isError, error, refetch } =
    usePortfolioPositions(page);
  const { data: statsData, isLoading: statsLoading } = usePortfolioStats();

  const positions = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const pnl = statsData?.totalPnl ?? 0;

  const actions = (
    <>
      <button
        type="button"
        onClick={() => refetch()}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Refresh
      </button>
      <Link
        to="/dashboard"
        className="inline-flex min-h-11 items-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
      >
        Browse stocks
      </Link>
    </>
  );

  return (
    <TradingLayout
      eyebrow="Portfolio"
      title="Positions and trading history"
      subtitle="Review holdings, monitor unrealized P/L, and manage simulated exits from one responsive workspace."
      actions={actions}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Invested"
          value={formatCurrency(statsData?.totalInvested ?? 0)}
          loading={statsLoading}
        />
        <StatTile
          label="Current value"
          value={formatCurrency(statsData?.totalCurrentValue ?? 0)}
          loading={statsLoading}
        />
        <StatTile
          label="Unrealized P/L"
          value={`${formatCurrency(pnl)} (${(statsData?.pnlPercentage ?? 0).toFixed(2)}%)`}
          loading={statsLoading}
          tone={pnl >= 0 ? "positive" : "negative"}
        />
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Page
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold text-white">
              {page + 1} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages - 1))
                }
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-lg bg-white/[0.06]"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-red-100">
            <h3 className="text-lg font-semibold">Unable to load positions</h3>
            <p className="mt-2 text-sm">
              {error?.message ?? "Please try again in a moment."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              Retry
            </button>
          </div>
        ) : positions.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
            <p className="text-sm text-slate-400">No holdings yet</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Your portfolio is empty
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Buy a stock from the market watchlist and your open positions will
              appear here with performance and sell actions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <PositionTable positions={positions} onSell={setSellSelection} />
            <div className="grid gap-4 lg:hidden">
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

      <PortfolioTrades />

      <SellStockModal
        isOpen={Boolean(sellSelection)}
        onClose={() => setSellSelection(null)}
        position={sellSelection}
      />
    </TradingLayout>
  );
};

export default PortfolioPositionsPage;
