import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSellOrder } from "../api/tradingAPI";

export const useSellOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSellOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
};
