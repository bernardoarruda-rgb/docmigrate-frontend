import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { TagListItem, TagResponse, CreateTagRequest, UpdateTagRequest, SetTagsRequest } from '@/types/tag'

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  detail: (id: number) => [...tagKeys.all, 'detail', id] as const,
  search: (q: string) => [...tagKeys.all, 'search', q] as const,
}

export const tagService = {
  getAll: () => apiClient.get<TagListItem[]>(ENDPOINTS.TAGS),
  getById: (id: number) => apiClient.get<TagResponse>(`${ENDPOINTS.TAGS}/${id}`),
  search: (query: string) => apiClient.get<TagListItem[]>(`${ENDPOINTS.TAGS}/search?q=${encodeURIComponent(query)}`),
  create: (data: CreateTagRequest) => apiClient.post<TagResponse>(ENDPOINTS.TAGS, data),
  update: (id: number, data: UpdateTagRequest) => apiClient.put<TagResponse>(`${ENDPOINTS.TAGS}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${ENDPOINTS.TAGS}/${id}`),
  setPageTags: (pageId: number, data: SetTagsRequest) => apiClient.put(ENDPOINTS.PAGES_TAGS(pageId), data),
  setSpaceTags: (spaceId: number, data: SetTagsRequest) => apiClient.put(ENDPOINTS.SPACES_TAGS(spaceId), data),
}
