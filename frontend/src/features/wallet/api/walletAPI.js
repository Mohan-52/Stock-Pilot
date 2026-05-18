import apiClient from "../../../services/apiClient";

/**
 * Wallet API
 */
export const getWallet = async () => {
  const res = await apiClient.get("/wallet");
  return res.data;
};
