import { useState } from "react";
import { useToast } from "../../../components/ToastProvider";
import {
  downloadPortfolioPdf,
  downloadWalletTransactionsExcel,
} from "../api/reportService";

const buttonClass =
  "inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50";

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20";

const ReportsPage = () => {
  const toast = useToast();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const handleDownloadPortfolioPdf = async () => {
    setIsDownloadingPdf(true);

    try {
      await downloadPortfolioPdf();
      toast.push("success", "Portfolio PDF download started.");
    } catch (error) {
      console.error(error);
      toast.push(
        "error",
        "Unable to download the portfolio PDF. Please try again.",
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadWalletTransactions = async () => {
    if (!fromDate || !toDate) {
      toast.push("error", "Please select both From and To dates.");
      return;
    }

    setIsDownloadingExcel(true);

    try {
      await downloadWalletTransactionsExcel(fromDate, toDate);
      toast.push("success", "Wallet transactions download started.");
    } catch (error) {
      console.error(error);
      toast.push(
        "error",
        "Unable to download wallet transactions. Please verify the date range and try again.",
      );
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Reports</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Download your portfolio statement and wallet transaction report.
            </p>
          </div>
        </div>

        <section className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Portfolio PDF
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Download a secured PDF summary of your portfolio positions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadPortfolioPdf}
                disabled={isDownloadingPdf}
                className={buttonClass}
              >
                {isDownloadingPdf ? "Downloading PDF..." : "Download PDF"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Wallet Transactions Excel
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Choose a date range and download your wallet activity as an Excel
                file.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-400">
                  <span>From</span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-400">
                  <span>To</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleDownloadWalletTransactions}
                  disabled={isDownloadingExcel}
                  className={buttonClass}
                >
                  {isDownloadingExcel
                    ? "Downloading Excel..."
                    : "Download Excel"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportsPage;
