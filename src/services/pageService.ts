import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { PageListItem, PageResponse, PageLockStatus, CreatePageRequest, UpdatePageRequest } from '@/types/page'
import type { PaginatedResponse } from '@/types/api'

export const pageKeys = {
  all: ['pages'] as const,
  lists: (spaceId: number) => [...pageKeys.all, 'list', spaceId] as const,
  detail: (id: number) => [...pageKeys.all, 'detail', id] as const,
}

export const pageService = {
  getAll: (spaceId: number, page = 1, pageSize = 50) =>
    apiClient.get<PaginatedResponse<PageListItem>>(
      `${ENDPOINTS.PAGES}?spaceId=${spaceId}&page=${page}&pageSize=${pageSize}`
    ),
  getById: (id: number) => apiClient.get<PageResponse>(`${ENDPOINTS.PAGES}/${id}`),
  create: (data: CreatePageRequest) => apiClient.post<PageResponse>(ENDPOINTS.PAGES, data),
  update: (id: number, data: UpdatePageRequest) =>
    apiClient.put<PageResponse>(`${ENDPOINTS.PAGES}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${ENDPOINTS.PAGES}/${id}`),
  reorder: (spaceId: number, items: Array<{ pageId: number; sortOrder: number }>) =>
    apiClient.put<void>(ENDPOINTS.PAGES_REORDER(spaceId), { items }),
  acquireLock: (pageId: number) =>
    apiClient.post<void>(ENDPOINTS.PAGES_LOCK(pageId), {}),
  releaseLock: (pageId: number) =>
    apiClient.delete(ENDPOINTS.PAGES_LOCK(pageId)),
  getLockStatus: (pageId: number) =>
    apiClient.get<PageLockStatus>(ENDPOINTS.PAGES_LOCK_STATUS(pageId)),
  autosave: (pageId: number, content: string) =>
    apiClient.patch<void>(ENDPOINTS.PAGES_AUTOSAVE(pageId), { content }),
}
