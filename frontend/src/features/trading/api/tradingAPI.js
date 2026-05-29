import apiClient from "../../../services/apiClient";

export const DEFAULT_PAGE_SIZE = 10;

const extractErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong."
  );
};

export const fetchPortfolioStats = async () => {
  const response = await apiClient.get("/portfolio/summary");
  return response.data;
};

export const fetchPositions = async ({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
} = {}) => {
  const response = await apiClient.get(
    `/portfolio/positions?page=${page}&size=${size}`,
  );
  return response.data;
};

export const fetchPortfolioTrades = async ({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
} = {}) => {
  const response = await apiClient.get(`/trades?page=${page}&size=${size}`);
  return response.data;
};

export const createBuyOrder = async ({ symbol, quantity }) => {
  try {
    const response = await apiClient.post("/orders/buy", { symbol, quantity });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const createSellOrder = async ({ symbol, quantity }) => {
  try {
    const response = await apiClient.post("/orders/sell", { symbol, quantity });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
