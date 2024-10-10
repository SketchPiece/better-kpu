import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateFavorite } from "@/lib/kpu-api/types";
import apiClient from "@/lib/kpu-api";

export function useFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ favorite, uid }: UpdateFavorite) =>
      apiClient.updateFavorite({ favorite, uid }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["services"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["other-services"],
      });
    },
  });
}
