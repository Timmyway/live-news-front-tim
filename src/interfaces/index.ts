import { IModel } from 'pouchorm';

export interface User {
  id: number;
  pseudo: string;
  email: string;
  avatar: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  author: User;
  updatedAt: string;
  createdAt: string;
}

export interface IPost extends IModel, Post {}

export interface ExtendedPost extends Post {
  // Additional properties that can be present in some objects
  extraProperty?: string;
}

export interface PrefetchedAvatars {
  [avatarUrl: string]: HTMLImageElement;
}

export interface PaginationConfig {
  items: number;
  maxItems: number;
  newItems: number;
  offlinePosts: number;
}

export interface CacheStatus {
  status: boolean;
  count: number;
}
