import { useQuery } from "@tanstack/react-query";
import { fetchPortfolioStats } from "../api/tradingAPI";

export const usePortfolioStats = () => {
  return useQuery({
    queryKey: ["portfolioStats"],
    queryFn: () => fetchPortfolioStats(),
    staleTime: 1000 * 60,
  });
};
