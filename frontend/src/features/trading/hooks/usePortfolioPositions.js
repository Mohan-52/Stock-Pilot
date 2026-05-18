import { useQuery } from "@tanstack/react-query";
import { fetchPositions, DEFAULT_PAGE_SIZE } from "../api/tradingAPI";

export const usePortfolioPositions = (page = 0) => {
  return useQuery({
    queryKey: ["positions", page],
    queryFn: () => fetchPositions({ page, size: DEFAULT_PAGE_SIZE }),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
};
