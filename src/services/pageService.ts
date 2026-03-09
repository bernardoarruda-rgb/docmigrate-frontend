import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { PageListItem, PageResponse, CreatePageRequest, UpdatePageRequest } from '@/types/page'

export const pageKeys = {
  all: ['pages'] as const,
  lists: (spaceId: number) => [...pageKeys.all, 'list', spaceId] as const,
  detail: (id: number) => [...pageKeys.all, 'detail', id] as const,
}

export const pageService = {
  getAll: (spaceId: number) =>
    apiClient.get<PageListItem[]>(`${ENDPOINTS.PAGES}?spaceId=${spaceId}`),
  getById: (id: number) => apiClient.get<PageResponse>(`${ENDPOINTS.PAGES}/${id}`),
  create: (data: CreatePageRequest) => apiClient.post<PageResponse>(ENDPOINTS.PAGES, data),
  update: (id: number, data: UpdatePageRequest) =>
    apiClient.put<PageResponse>(`${ENDPOINTS.PAGES}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${ENDPOINTS.PAGES}/${id}`),
}
