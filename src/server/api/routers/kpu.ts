import { categoryValues } from "@/lib/categories";
import kpuApiClient from "@/lib/kpu-api/kpu-api-client";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

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
    .query(async ({ input }) => kpuApiClient.getAllServices(input)),

  getQuickServices: publicProcedure
    .input(
      z.object({
        roles: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input }) => kpuApiClient.getQuickServices(input)),
  test: publicProcedure.query(() => {
    return "hello";
  }),
});
