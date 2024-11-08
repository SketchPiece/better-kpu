import { z } from "zod";
import type {
  Service,
  UpdateFavorite,
  UserProfile,
  // Notification,
  ApiClient,
  SchoolNotification,
} from "./types";
import { refineService } from "./refine-service";
import type { CategoryValue } from "../categories";
import Cookies from "js-cookie";
import { parseHtmlString } from "../utils";
import { dangerousKpuApiInstance } from "./dangerous-kpu-api-instance";

const commonOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const tileSchema = z.object({
  title: z.string(),
  uniqueKey: z.string(),
  favorite: z.boolean(),
  task: z.object({
    taskId: z.number(),
    uid: z.string(),
    tabletHighResolutionImageCdnUrl: z.string(),
  }),
});

const userProfileDataSchema = z.object({
  user: z.object({
    userId: z.number(),
    email: z.string(),
    userName: z.string(),
    userInitials: z.string(),
    greetingName: z.string(),
  }),
});

const notificationSchema = z.object({
  announcementId: z.number(),
  title: z.string(),
  description: z.string(),
});

type UserProfileData = z.infer<typeof userProfileDataSchema>;

function mapUserProfile(userData: UserProfileData): UserProfile {
  return {
    userId: userData.user.userId.toString(),
    email: userData.user.email,
    username: userData.user.userName,
    initials: userData.user.userInitials,
    greetingName: userData.user.greetingName,
  };
}

function mapTileToService(rawTile: unknown) {
  const parseResult = tileSchema.safeParse(rawTile);
  if (!parseResult.success) return null;
  const tile = parseResult.data;
  return refineService({
    id: tile.task.taskId,
    uid: tile.task.uid,
    title: tile.title,
    image: tile.task.tabletHighResolutionImageCdnUrl,
    uniqueKey: tile.uniqueKey,
    favorite: tile.favorite,
  });
}

function mapNotification(rawNotification: unknown): SchoolNotification | null {
  const parseResult = notificationSchema.safeParse(rawNotification);
  if (!parseResult.success) return null;
  const notification = parseResult.data;
  return {
    id: notification.announcementId,
    title: notification.title,
    description: notification.description,
    content: parseHtmlString(notification.description) ?? [],
  };
}

function defineUniqueKey(
  category?: CategoryValue | null,
  searchQuery?: string,
) {
  if (category) return category;
  if (searchQuery) return "_search_";
  return "_popular_";
}

const kpuApiClient: ApiClient = {
  getAllServices: async ({ pageNumber = 0, searchQuery, category, roles }) => {
    const uniqueKey = defineUniqueKey(category, searchQuery);
    const collectionOptions = category
      ? { categoryUniqueKey: uniqueKey }
      : { taskCollectionUniqueKey: uniqueKey };

    const response = await dangerousKpuApiInstance.post("/tasks", {
      pageNumber,
      mobile: false,
      mobileOnly: false,
      terms: searchQuery,
      roleUniqueKeys: roles?.map((role) =>
        role === "employee" ? "kpuemployee" : role,
      ),
      ...collectionOptions,
    });
    const rawCollectionData = z
      .object({
        taskCollections: z.array(
          z.object({
            uniqueKey: z.string(),
            tiles: z.array(z.unknown()),
            hasMore: z.boolean(),
          }),
        ),
      })
      .parse(response.data);

    const rawCollection = rawCollectionData.taskCollections.find(
      (item: { uniqueKey: string }) => item.uniqueKey === uniqueKey,
    );

    const rawTiles = rawCollection?.tiles ?? [];

    const services: Service[] = rawTiles.map(mapTileToService).filter(Boolean);

    return {
      data: services,
      hasNextPage: Boolean(rawCollection?.hasMore),
      page: pageNumber,
    };
  },
  getQuickServices: async ({ roles }: { roles?: string[] } = {}) => {
    const response = await dangerousKpuApiInstance.post("/tasks", {
      pageNumber: 0,
      mobile: false,
      mobileOnly: false,
      roleUniqueKeys: roles?.map((role) =>
        role === "employee" ? "kpuemployee" : role,
      ),
    });

    const rawCollectionData = z
      .object({
        taskCollections: z.array(
          z.object({
            uniqueKey: z.string(),
            tiles: z.array(z.unknown()),
            hasMore: z.boolean(),
          }),
        ),
      })
      .parse(response.data);

    const rawFeaturedTiles =
      rawCollectionData.taskCollections.find(
        (item: { uniqueKey: string }) => item.uniqueKey === "_featured_",
      )?.tiles ?? [];
    const rawFavoritesTiles =
      rawCollectionData.taskCollections.find(
        (item: { uniqueKey: string }) => item.uniqueKey === "_favorite_",
      )?.tiles ?? [];
    const rawRecentTiles =
      rawCollectionData.taskCollections.find(
        (item: { uniqueKey: string }) => item.uniqueKey === "_recentlyUsed_",
      )?.tiles ?? [];

    const featuredServices: Service[] = rawFeaturedTiles
      ?.map(mapTileToService)
      .filter(Boolean);

    const favoriteServices: Service[] = rawFavoritesTiles
      ?.map(mapTileToService)
      .filter(Boolean);

    const recentServices: Service[] = rawRecentTiles
      ?.map(mapTileToService)
      .filter(Boolean);

    return {
      essentials: featuredServices,
      favorites: favoriteServices,
      recents: recentServices,
    };
  },
  getUserProfile: async (): Promise<UserProfile | null> => {
    const rawProfileData = await fetch("/res/settings?module=store", {
      method: "GET",
      ...commonOptions,
    }).then((res) => res.json());
    const parsedUserProfile = userProfileDataSchema.safeParse(rawProfileData);
    if (!parsedUserProfile.success) return null;
    const userProfile = mapUserProfile(parsedUserProfile.data);
    return userProfile;
  },
  updateFavorite: async ({ service }: UpdateFavorite) => {
    await fetch("https://one.kpu.ca/favorite", {
      method: "POST",
      body: JSON.stringify({
        status: service.favorite,
        taskUid: service.uid,
      }),
      headers: {
        ...commonOptions.headers,
        "x-xsrf-token": Cookies.get("XSRF-TOKEN") ?? "",
      },
    });
  },
  updateRecent: () => {
    return Promise.resolve();
  },
  getNotifications: async () => {
    const result = await dangerousKpuApiInstance.get(
      "https://one.kpu.ca/announcement/list?dismissed=false",
    );

    const rawNotificationsData = z.array(z.unknown()).parse(result.data);
    const notifications = rawNotificationsData
      .map(mapNotification)
      .filter((notification) => notification !== null);

    return notifications;
  },
};

export default kpuApiClient;
