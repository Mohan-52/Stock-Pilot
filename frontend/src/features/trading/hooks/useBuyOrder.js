import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBuyOrder } from "../api/tradingAPI";

export const useBuyOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBuyOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
};
