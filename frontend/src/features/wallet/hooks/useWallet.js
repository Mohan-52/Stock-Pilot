import { useQuery } from "@tanstack/react-query";
import { getWallet } from "../api/walletAPI";

export const WALLET_QUERY_KEY = ["wallet"];

export const useWallet = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEY,
    queryFn: async () => {
      const data = await getWallet();
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
};
