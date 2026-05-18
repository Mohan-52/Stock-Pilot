import { formatCurrency, formatPercentage } from "../../../utils/formatters";

const PositionTable = ({ positions, onSell }) => {
  return (
    <div className="hidden min-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:block">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4 font-semibold">Symbol</th>
            <th className="px-6 py-4 font-semibold">Quantity</th>
            <th className="px-6 py-4 font-semibold">Avg price</th>
            <th className="px-6 py-4 font-semibold">Current price</th>
            <th className="px-6 py-4 font-semibold">Invested</th>
            <th className="px-6 py-4 font-semibold">Current value</th>
            <th className="px-6 py-4 font-semibold">P/L</th>
            <th className="px-6 py-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {positions.map((position) => {
            const pnlPositive = position.pnl >= 0;
            return (
              <tr
                key={position.symbol}
                className="hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <td className="px-6 py-5 font-semibold text-slate-900 dark:text-white">
                  {position.symbol}
                </td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {position.quantity}
                </td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {formatCurrency(position.avgPriceInCents)}
                </td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {formatCurrency(position.currentPriceInCents)}
                </td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {formatCurrency(position.invested)}
                </td>
                <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                  {formatCurrency(position.currentValue)}
                </td>
                <td
                  className={`px-6 py-5 font-semibold ${pnlPositive ? "text-emerald-500" : "text-red-500"}`}
                >
                  <div>{formatCurrency(position.pnl)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatPercentage(position.pnlPercentage)}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <button
                    type="button"
                    onClick={() => onSell(position)}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Sell
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PositionTable;
