import apiClient from "@/lib/kpu-api";
import { useQuery } from "@tanstack/react-query";

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiClient.getNotifications(),
  });
}
