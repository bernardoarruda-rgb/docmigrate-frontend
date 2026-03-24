import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { SpaceListItem, SpaceResponse, CreateSpaceRequest, UpdateSpaceRequest } from '@/types/space'
import type { PaginatedResponse } from '@/types/api'

export const spaceKeys = {
  all: ['spaces'] as const,
  lists: () => [...spaceKeys.all, 'list'] as const,
  detail: (id: number) => [...spaceKeys.all, 'detail', id] as const,
}

export const spaceService = {
  getAll: (page = 1, pageSize = 20) =>
    apiClient.get<PaginatedResponse<SpaceListItem>>(
      `${ENDPOINTS.SPACES}?page=${page}&pageSize=${pageSize}`
    ),
  getById: (id: number) => apiClient.get<SpaceResponse>(`${ENDPOINTS.SPACES}/${id}`),
  create: (data: CreateSpaceRequest) => apiClient.post<SpaceResponse>(ENDPOINTS.SPACES, data),
  update: (id: number, data: UpdateSpaceRequest) =>
    apiClient.put<SpaceResponse>(`${ENDPOINTS.SPACES}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${ENDPOINTS.SPACES}/${id}`),
}
