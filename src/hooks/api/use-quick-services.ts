import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/kpu-api";
import type { Service } from "@/lib/kpu-api/types";
import type { QuickFiltersValue } from "@/components/home/quick-filters";
import { usePreferencesContext } from "@/components/contexts/preferences-context";

interface QuickServicesProps {
  initialQuickServices?: Record<QuickFiltersValue, Service[]>;
  quickFilter?: QuickFiltersValue;
  onServicesEmptyUpdate?: (data: Record<QuickFiltersValue, boolean>) => void;
}

function defineServices(
  key?: QuickFiltersValue,
  services?: Record<string, Service[]>,
) {
  if (key === "essentials") return services?.essentials;
  else if (key === "favorites") return services?.favorites;
  else if (key === "recents") return services?.recents;
  return undefined;
}

// I have no idea why useQuery doesn't invalidate the query when the roles change
// but this is a workaround
export function useQuickServicesInvalidationFix() {
  const queryClient = useQueryClient();
  return (roles: string[]) => {
    setTimeout(() => {
      void queryClient.invalidateQueries({
        queryKey: ["quick-services", roles.sort().join(",")],
      });
    });
  };
}

export function useQuickServices({
  quickFilter,
  onServicesEmptyUpdate,
  initialQuickServices,
}: QuickServicesProps) {
  const { preferences } = usePreferencesContext();
  const rolesKey = preferences.roles.sort().join(",");

  const { data: services, ...rest } = useQuery({
    initialData: initialQuickServices,
    queryKey: ["quick-services", rolesKey],
    queryFn: () => apiClient.getQuickServices({ roles: preferences.roles }),
    refetchOnWindowFocus: "always",
  });

  useEffect(() => {
    if (services)
      onServicesEmptyUpdate?.({
        essentials: services.essentials
          ? services.essentials.length === 0
          : true,
        favorites: services.favorites ? services.favorites.length === 0 : true,
        recents: services.recents ? services.recents.length === 0 : true,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  const quickServices = defineServices(quickFilter, services);
  const quickServicesIds = quickServices?.map(({ id }) => id) ?? [];

  return {
    data: quickServices,
    dataIds: quickServicesIds,
    ...rest,
  };
}
