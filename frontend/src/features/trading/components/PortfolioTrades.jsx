import { useState } from "react";
import { usePortfolioTrades } from "../hooks/usePortfolioTrades";
import { formatCurrency } from "../../../utils/formatters";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const getTradeTypeColor = (type) => {
  return type === "BUY"
    ? "bg-emerald-400/15 text-emerald-300"
    : "bg-red-400/15 text-red-300";
};

const getTradeTypeLabel = (type) => {
  return type === "BUY" ? "BUY" : "SELL";
};

const PortfolioTrades = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, isError, error } = usePortfolioTrades(
    currentPage,
    pageSize,
  );

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data && !data.last) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0);
  };

  return (
    <section className="mt-6 rounded-lg border border-white/10 bg-[#0b1728] p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Trading history</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Your trades
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="tradePageSize"
            className="text-sm font-medium text-slate-400"
          >
            Per page:
          </label>
          <select
            id="tradePageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition focus:border-emerald-300 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-lg bg-white/[0.06]"
            />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-6">
          <h3 className="font-semibold text-red-100">Failed to load trades</h3>
          <p className="mt-2 text-sm text-red-200">
            {error?.message || "Please try again later."}
          </p>
        </div>
      )}

      {data && data.content.length === 0 && !isLoading && (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
          <p className="text-sm text-slate-400">No trades yet</p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Your trade history will appear here
          </h3>
        </div>
      )}

      {data && data.content.length > 0 && !isLoading && (
        <>
          <div className="grid gap-3 md:hidden">
            {data.content.map((trade) => (
              <div
                key={trade.id}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTradeTypeColor(
                      trade.type,
                    )}`}
                  >
                    {getTradeTypeLabel(trade.type)}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {trade.type === "BUY" ? "+" : "-"}
                    {formatCurrency(trade.priceIncents)}
                  </span>
                </div>
                <p className="mt-3 break-all text-xs text-slate-500">
                  {trade.tradeId}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {formatDate(trade.executed)}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Reference ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.content.map((trade) => (
                  <tr key={trade.id} className="transition hover:bg-white/[0.04]">
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTradeTypeColor(
                          trade.type,
                        )}`}
                      >
                        {getTradeTypeLabel(trade.type)}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-white">
                      {trade.type === "BUY" ? "+" : "-"}
                      {formatCurrency(trade.priceIncents)}
                    </td>
                    <td className="break-all px-4 py-4 text-xs text-slate-400">
                      {trade.tradeId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-400">
                      {formatDate(trade.executed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-400">
              Showing {currentPage * pageSize + 1} to{" "}
              {Math.min((currentPage + 1) * pageSize, data.totalElements)} of{" "}
              {data.totalElements} trades
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-slate-300">
                Page {currentPage + 1} of {data.totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={data.last}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default PortfolioTrades;
