import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "../api/paymentsAPI";

export const useCreatePaymentIntent = (options = {}) => {
  return useMutation({
    mutationFn: ({ amount }) => createPaymentIntent(amount),
    ...options,
  });
};
