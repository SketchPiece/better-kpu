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
import type { Service } from "@/lib/kpu-api/types";
import { favorites, recents, services } from "@/server/db/schema";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/server/db";

async function upsertService(service: Service) {
  await db
    .insert(services)
    .values(service)
    .onConflictDoUpdate({
      target: services.uniqueKey,
      set: {
        title: sql`excluded.title`,
        image: sql`excluded.image`,
        description: sql`excluded.description`,
      },
    });
}

async function getUserFavorites(userId: string): Promise<Service[]> {
  const result = await db
    .select()
    .from(favorites)
    .innerJoin(services, eq(favorites.serviceId, services.id))
    .where(eq(favorites.userId, userId));
  return result.map((r) => ({
    ...r.services,
    favorite: true,
  }));
}

async function getRecentServices(userId: string): Promise<Service[]> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await db
    .select()
    .from(recents)
    .innerJoin(services, eq(recents.serviceId, services.id))
    .where(and(eq(recents.userId, userId), gt(recents.createdAt, oneDayAgo)))
    .orderBy(desc(recents.createdAt))
    .limit(8);
  return result.map((r) => ({
    ...r.services,
    favorite: false,
  }));
}

const serviceSchema = z.object({
  id: z.number(),
  uid: z.string(),
  uniqueKey: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  favorite: z.boolean(),
});

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
        () => kpuApiClient.getAllServices(input),
      );
      if (!userId) return services;
      const favorites = await getUserFavorites(userId);
      const favoriteIds = favorites.map((s) => s.uid);
      return {
        ...services,
        data: services.data.map(mapFavorites(favoriteIds)),
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
        () => kpuApiClient.getQuickServices(input),
      );

      if (!userId) return quickServices;

      const favorites = await getUserFavorites(userId);
      const favoriteIds = favorites.map((s) => s.uid);
      const recents = await getRecentServices(userId);

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
    .input(
      z.object({
        service: serviceSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await upsertService(input.service);
      if (input.service.favorite) {
        await ctx.db
          .insert(favorites)
          .values({
            userId: ctx.session.user.id,
            serviceId: input.service.id,
          })
          .onConflictDoNothing();
      } else {
        await ctx.db
          .delete(favorites)
          .where(
            and(
              eq(favorites.userId, ctx.session.user.id),
              eq(favorites.serviceId, input.service.id),
            ),
          );
      }
    }),
  updateRecent: protectedProcedure
    .input(
      z.object({
        service: serviceSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await upsertService(input.service);
      await ctx.db
        .insert(recents)
        .values({
          userId: ctx.session.user.id,
          serviceId: input.service.id,
        })
        .onConflictDoUpdate({
          target: [recents.userId, recents.serviceId],
          set: {
            createdAt: sql`now()`,
          },
        });
    }),
});
