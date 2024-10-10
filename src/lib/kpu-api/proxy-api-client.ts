import { trpcClient } from "@/trpc/react";
import type { ApiClient, UpdateFavorite } from "./types";

const proxyApiClient: ApiClient = {
  getAllServices: ({ pageNumber = 0, searchQuery, category, roles }) => {
    return trpcClient.kpu.getAllServices.query({
      pageNumber,
      searchQuery,
      category: category ?? undefined,
      roles,
    });
  },
  getQuickServices: (params = {}) => {
    return trpcClient.kpu.getQuickServices.query(params);
  },
  getUserProfile: async () => {
    return null;
  },
  updateFavorite: async (_: UpdateFavorite) => {
    return;
  },
  getNotifications: async () => {
    return [];
  },
};

export default proxyApiClient;
