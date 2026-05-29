import { useQuery } from "@tanstack/react-query";
import { getWalletTransactions } from "../api/walletAPI";

export const WALLET_TRANSACTIONS_QUERY_KEY = ["walletTransactions"];

export const useWalletTransactions = (page = 0, size = 10) => {
  return useQuery({
    queryKey: [WALLET_TRANSACTIONS_QUERY_KEY, page, size],
    queryFn: async () => {
      const data = await getWalletTransactions(page, size);
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
};
