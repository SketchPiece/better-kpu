import apiClient from "@/lib/kpu-api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { CategoryValue } from "@/lib/categories";
import type { Service } from "@/lib/kpu-api/types";
import { usePreferencesContext } from "@/components/contexts/preferences-context";

interface ServicesInfiniteQueryProps {
  searchQuery?: string;
  category?: CategoryValue | null;
  initialServices?: {
    data: Service[];
    hasNextPage: boolean;
    page: number;
  };
}

export function useServicesInfiniteQuery({
  searchQuery,
  category,
  initialServices,
}: ServicesInfiniteQueryProps) {
  const { preferences } = usePreferencesContext();
  const lastCategory = useRef(category);
  const { data, fetchNextPage, hasNextPage, isLoading, ...rest } =
    useInfiniteQuery({
      initialData:
        initialServices && !searchQuery && !category
          ? { pages: [initialServices], pageParams: [0] }
          : undefined,
      queryKey: [
        "services",
        searchQuery,
        category,
        preferences.roles.sort().join(","),
      ],
      queryFn: ({ pageParam }) =>
        apiClient.getAllServices({
          pageNumber: pageParam,
          searchQuery,
          category,
          roles: preferences.roles,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : null,
    });

  const flatPagesData = data?.pages.flatMap((page) => page.data);

  useEffect(() => {
    if (isLoading) return;
    if (category !== lastCategory.current && category !== null) {
      lastCategory.current = category;
      if (hasNextPage) void fetchNextPage();
    } else if (!category) {
      lastCategory.current = category;
    }
  }, [category, hasNextPage, fetchNextPage, isLoading]);

  return {
    data: flatPagesData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    ...rest,
  };
}
