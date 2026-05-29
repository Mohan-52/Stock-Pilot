import { useQuery } from "@tanstack/react-query";
import { fetchPortfolioTrades, DEFAULT_PAGE_SIZE } from "../api/tradingAPI";

export const usePortfolioTrades = (page = 0, size = DEFAULT_PAGE_SIZE) => {
  return useQuery({
    queryKey: ["portfolioTrades", page, size],
    queryFn: () => fetchPortfolioTrades({ page, size }),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
};
