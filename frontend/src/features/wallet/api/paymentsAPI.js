import apiClient from "../../../services/apiClient";

/**
 * Payments API
 */
export const createPaymentIntent = async (amount) => {
  const res = await apiClient.post(`/payments/create-intent`, { amount });
  return res.data;
};
