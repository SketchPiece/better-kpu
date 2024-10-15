import { Service } from "@/lib/kpu-api/types";
import { kv } from "@vercel/kv";

class FavoriteStore {
  async addFavorite(userId: string, favoriteId: string) {
    const favorites = (await kv.get<string[]>(`favorites:${userId}`)) ?? [];
    favorites.push(favoriteId);
    await kv.set(`favorites:${userId}`, favorites);
  }

  async removeFavorite(userId: string, favoriteId: string) {
    const favorites = (await kv.get<string[]>(`favorites:${userId}`)) ?? [];
    favorites.splice(favorites.indexOf(favoriteId), 1);
    await kv.set(`favorites:${userId}`, favorites);
  }

  async getFavorites(userId: string) {
    return (await kv.get<string[]>(`favorites:${userId}`)) ?? [];
  }
}

export const favoriteStore = new FavoriteStore();

export const mapFavorites = (favorites: string[]) => (service: Service) => {
  return {
    ...service,
    favorite: favorites.includes(service.uid),
  } satisfies Service;
};
