import apiClient from "../../../services/apiClient";
import { normalizeStockList } from "../utils/stockUpdates";

export const fetchWatchlist = async () => {
  const response = await apiClient.get("/watchlist");
  return normalizeStockList(response.data);
};

export const addToWatchlist = async (symbol) => {
  const response = await apiClient.post(
    `/watchlist?symbol=${encodeURIComponent(symbol)}`,
  );
  return response.data;
};

export const removeFromWatchlist = async (symbol) => {
  const response = await apiClient.delete(
    `/watchlist?symbol=${encodeURIComponent(symbol)}`,
  );
  return response.data;
};
