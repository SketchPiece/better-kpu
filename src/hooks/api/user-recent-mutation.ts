import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateFavorite } from "@/lib/kpu-api/types";
import apiClient from "@/lib/kpu-api";

export function useRecentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ service }: UpdateFavorite) =>
      apiClient.updateRecent({ service }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["quick-services"],
      });
    },
  });
}
