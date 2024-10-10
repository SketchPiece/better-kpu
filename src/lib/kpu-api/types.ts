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
  updateFavorite: (params: UpdateFavorite) => Promise<void>;
  getNotifications: () => Promise<Notification[]>;
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
  favorite: boolean;
  uid: string;
}

export interface Attribute {
  class?: string;
  style?: string;
}

export interface Child {
  type: string;
  value?: string;
  attributes?: Attribute;
  children?: Child[];
}

export interface Element {
  type: string;
  attributes?: Attribute;
  children?: Child[];
}

export type ContentStructure = (Element | Child)[];

export interface Notification {
  id: number;
  title: string;
  description: string;
  content: ContentStructure;
}
