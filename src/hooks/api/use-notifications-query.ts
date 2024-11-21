import apiClient from "@/lib/kpu-api";
import { useQuery } from "@tanstack/react-query";

function showFakeNotifications() {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  return url.searchParams.get("fake") === "true";
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      apiClient.getNotifications({
        showFake: showFakeNotifications(),
      }),
  });
}
