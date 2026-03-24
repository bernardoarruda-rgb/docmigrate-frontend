import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { FavoritePageItem, RecentPageItem } from '@/types/userActivity'

export const userActivityKeys = {
  all: ['userActivity'] as const,
  favorites: () => [...userActivityKeys.all, 'favorites'] as const,
  favoriteCheck: (pageId: number) => [...userActivityKeys.all, 'favorite', pageId] as const,
  recent: () => [...userActivityKeys.all, 'recent'] as const,
}

export const userActivityService = {
  getFavorites: () => apiClient.get<FavoritePageItem[]>(ENDPOINTS.USER_FAVORITES),
  isFavorite: (pageId: number) => apiClient.get<{ isFavorite: boolean }>(ENDPOINTS.USER_FAVORITE_CHECK(pageId)),
  toggleFavorite: (pageId: number) => apiClient.post<void>(ENDPOINTS.USER_FAVORITE_TOGGLE(pageId), {}),
  getRecent: (limit = 10) => apiClient.get<RecentPageItem[]>(`${ENDPOINTS.USER_RECENT}?limit=${limit}`),
  recordVisit: (pageId: number) => apiClient.post<void>(ENDPOINTS.USER_VISIT(pageId), {}),
}
