import apiClient from "../../../services/apiClient";

/**
 * Wallet API
 */
export const getWallet = async () => {
  const res = await apiClient.get("/wallet");
  return res.data;
};

export const getWalletTransactions = async (page = 0, size = 10) => {
  const res = await apiClient.get("/wallet/transactions", {
    params: { page, size },
  });
  return res.data;
};
