import type { CategoryValue } from "../categories";

interface ServicesQueryParams {
  pageNumber?: number;
  searchQuery?: string;
  // Todo: try to get rid of null
  category?: CategoryValue | null;
  roles?: string[];
}

export interface ApiClient {
  getAllServices: (params: ServicesQueryParams) => Promise<{
    data: Service[];
    hasNextPage: boolean;
    page: number;
  }>;
  getQuickServices: (params: { roles?: string[] }) => Promise<{
    essentials: Service[];
    favorites: Service[];
    recents: Service[];
  }>;
  getUserProfile: () => Promise<UserProfile | null>;
  getNotifications: () => Promise<SchoolNotification[]>;
  updateFavorite: (params: UpdateFavorite) => Promise<void>;
  updateRecent: (params: UpdateFavorite) => Promise<void>;
}

export interface Service {
  id: number;
  uid: string;
  uniqueKey: string;
  title: string;
  description: string;
  image: string;
  favorite: boolean;
}

export interface UserProfile {
  userId: string;
  email: string;
  username: string;
  initials: string;
  greetingName: string;
}

export interface UpdateFavorite {
  service: Service;
}

export interface Child {
  type: string;
  value?: string;
  attributes?: Record<string, string>;
  children?: Child[];
}

export interface ObjectElement {
  type: string;
  attributes: Record<string, string>;
  children?: Child[];
}

export type ContentStructure = (ObjectElement | Child)[];

export interface SchoolNotification {
  id: number;
  title: string;
  description: string;
  content: ContentStructure;
}
