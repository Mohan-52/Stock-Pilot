import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import SkeletonLoader from "./SkeletonLoader";

const formatCurrency = (amount, currency = "USD") => {
  const value = amount / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
};

const WalletCard = ({ onAddMoney }) => {
  const { data, isLoading, error } = useWallet();

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">Wallet</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {isLoading ? (
              <SkeletonLoader className="h-8 w-40" />
            ) : error ? (
              <div className="text-red-500">Failed to load</div>
            ) : (
              <div>{formatCurrency(data.balance, data.currency)}</div>
            )}
          </div>
          {!isLoading && !error && (
            <div className="mt-1 text-sm text-gray-500">
              Currency: {data.currency}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onAddMoney}
            className="px-4 py-2 bg-black text-white rounded shadow"
          >
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
