import kpuApiClient from "@/lib/kpu-api/kpu-api-client";
import { db } from "@/server/db";
import { services } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export async function POST(_: Request) {
  return new Response("OK", { status: 200 });
  let page = 0;
  let apiResult = await kpuApiClient.getAllServices({
    pageNumber: page,
  });
  let servicesPayload = apiResult.data.map((s) => {
    return {
      uid: s.uid,
      title: s.title,
      image: s.image,
      uniqueKey: s.uniqueKey,
      description: s.description,
    };
  });
  page += 1;
  while (apiResult?.hasNextPage) {
    console.log("Fetching page", page);
    apiResult = await kpuApiClient.getAllServices({
      pageNumber: page,
    });

    servicesPayload = servicesPayload.concat(
      apiResult.data.map((s) => {
        return {
          uid: s.uid,
          title: s.title,
          image: s.image,
          uniqueKey: s.uniqueKey,
          description: s.description,
        };
      }),
    );
    page += 1;
  }

  servicesPayload = servicesPayload.reduce(
    (acc, obj) => {
      if (!acc.some((item) => item.uid === obj.uid)) {
        acc.push(obj);
      }
      return acc;
    },
    [] as typeof servicesPayload,
  );

  await db
    .insert(services)
    .values(servicesPayload)
    .onConflictDoUpdate({
      target: services.uid,
      set: {
        title: sql`excluded.title`,
        image: sql`excluded.image`,
        uniqueKey: sql`excluded.unique_key`,
        description: sql`excluded.description`,
      },
    });

  return new Response("OK", { status: 200 });
}
