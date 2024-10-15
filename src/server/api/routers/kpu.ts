import { categoryValues } from "@/lib/categories";
import kpuApiClient from "@/lib/kpu-api/kpu-api-client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import cache from "@/server/cache";
import { favoriteStore, mapFavorites } from "@/server/helpers";
import { kv } from "@vercel/kv";
import type { Service } from "@/lib/kpu-api/types";

async function cacheIndividualServices(services: Service[]) {
  const cacheIndividual = services.map(async (service) =>
    kv.set(`service:${service.uid}`, service),
  );
  await Promise.all(cacheIndividual);
}

async function getCachedServicesByIds(uids: string[]) {
  return (
    await Promise.all(uids.map((uid) => kv.get<Service>(`service:${uid}`)))
  ).filter(Boolean);
}

export const kpuRouter = createTRPCRouter({
  getAllServices: publicProcedure
    .input(
      z.object({
        pageNumber: z.number().optional(),
        searchQuery: z.string().optional(),
        category: z.enum(categoryValues).optional(),
        roles: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;
      const services = await cache(
        `services:${input.pageNumber ?? "0"}:${input.category ?? "all"}:${input.searchQuery ?? "all"}:${input.roles?.join(",") ?? "all"}`,
        async () => {
          const services = await kpuApiClient.getAllServices(input);
          await cacheIndividualServices(services.data);
          return services;
        },
      );
      if (!userId) return services;
      const favorites = await favoriteStore.getFavorites(userId);
      return {
        ...services,
        data: services.data.map(mapFavorites(favorites)),
      };
    }),

  getQuickServices: publicProcedure
    .input(
      z.object({
        roles: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;
      const quickServices = await cache(
        `quickServices:${input.roles?.join(",") ?? "all"}`,
        async () => {
          const quickServices = await kpuApiClient.getQuickServices(input);
          await cacheIndividualServices(quickServices.essentials);
          return quickServices;
        },
      );

      if (!userId) return quickServices;
      // rewrite favorites
      const favoriteIds = await favoriteStore.getFavorites(userId);
      const recentIds = await kv.lrange<string>(`recents:${userId}`, 0, -1);
      const favorites = await getCachedServicesByIds(favoriteIds);
      const recents = await getCachedServicesByIds(recentIds);

      return {
        favorites: favorites.map((service) => ({ ...service, favorite: true })),
        essentials: quickServices.essentials.map(mapFavorites(favoriteIds)),
        recents: recents.map(mapFavorites(favoriteIds)),
      };
    }),
  getNotifications: publicProcedure.query(() => {
    return cache(`notifications`, () => kpuApiClient.getNotifications());
  }),
  updateFavorite: protectedProcedure
    .input(z.object({ uid: z.string(), favorite: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (input.favorite) {
        await favoriteStore.addFavorite(ctx.session.user.id, input.uid);
      } else {
        await favoriteStore.removeFavorite(ctx.session.user.id, input.uid);
      }
    }),

  getServiceUniqueKey: publicProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;
      const service = await kv.get<Service>(`service:${input.uid}`);
      if (userId) {
        await kv.lrem(`recents:${userId}`, 0, input.uid);
        await kv.lpush(`recents:${userId}`, input.uid);
        await kv.ltrim(`recents:${userId}`, 0, 7);
      }
      return service?.uniqueKey;
    }),
});
