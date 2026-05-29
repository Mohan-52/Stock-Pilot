import { formatCurrency, formatPercentage } from "../../../utils/formatters";

const PositionTable = ({ positions, onSell }) => {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-[#0b1728] lg:block">
      <div className="overflow-x-auto">
      <table className="min-w-[980px] w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/[0.04] text-slate-400">
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
        <tbody className="divide-y divide-white/10">
          {positions.map((position) => {
            const pnlPositive = position.pnl >= 0;
            return (
              <tr
                key={position.symbol}
                className="transition hover:bg-white/[0.04]"
              >
                <td className="px-6 py-5 font-semibold text-white">
                  {position.symbol}
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {position.quantity}
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {formatCurrency(position.avgPriceInCents)}
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {formatCurrency(position.currentPriceInCents)}
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {formatCurrency(position.invested)}
                </td>
                <td className="px-6 py-5 text-slate-300">
                  {formatCurrency(position.currentValue)}
                </td>
                <td
                  className={`px-6 py-5 font-semibold ${pnlPositive ? "text-emerald-500" : "text-red-500"}`}
                >
                  <div>{formatCurrency(position.pnl)}</div>
                  <div className="text-xs text-slate-500">
                    {formatPercentage(position.pnlPercentage)}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <button
                    type="button"
                    onClick={() => onSell(position)}
                    className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
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
    </div>
  );
};

export default PositionTable;
