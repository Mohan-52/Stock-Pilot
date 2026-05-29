import { useState } from "react";
import { useWalletTransactions } from "../hooks/useWalletTransactions";
import SkeletonLoader from "./SkeletonLoader";

const formatCurrency = (amount, currency = "USD") => {
  const value = amount / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const getTransactionTypeColor = (type) => {
  return type === "BUY"
    ? "bg-emerald-400/15 text-emerald-300"
    : "bg-red-400/15 text-red-300";
};

const getTransactionTypeLabel = (type) => {
  return type === "BUY" ? "Bought" : "Sold";
};

const WalletTransactions = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, error } = useWalletTransactions(
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
    <div className="mt-6 w-full rounded-lg border border-white/10 bg-[#0b1728] p-4 sm:p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Transaction History
      </h2>

      <div className="mb-4 flex justify-end">
        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-sm text-slate-400">
            Show per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
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
          <SkeletonLoader className="h-12 w-full" />
          <SkeletonLoader className="h-12 w-full" />
          <SkeletonLoader className="h-12 w-full" />
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-8">
          <p className="text-red-300">
            Failed to load transactions. Please try again later.
          </p>
        </div>
      )}

      {data && data.content.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-slate-400">No transactions yet.</p>
        </div>
      )}

      {data && data.content.length > 0 && !isLoading && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-[680px] w-full text-sm">
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
              <tbody>
                {data.content.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-white/10 transition hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTransactionTypeColor(
                          transaction.type,
                        )}`}
                      >
                        {getTransactionTypeLabel(transaction.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {transaction.type === "BUY" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="break-all px-4 py-3 text-xs text-slate-400">
                      {transaction.referenceId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Showing {currentPage * pageSize + 1} to{" "}
              {Math.min((currentPage + 1) * pageSize, data.totalElements)} of{" "}
              {data.totalElements} transactions
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="px-3 py-2 text-sm text-slate-400">
                Page {currentPage + 1} of {data.totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={data.last}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletTransactions;
