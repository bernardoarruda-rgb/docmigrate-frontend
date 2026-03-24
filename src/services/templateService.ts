import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { TemplateListItem, TemplateResponse, CreateTemplateRequest, UpdateTemplateRequest } from '@/types/template'

export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  detail: (id: number) => [...templateKeys.all, 'detail', id] as const,
}

export const templateService = {
  getAll: () => apiClient.get<TemplateListItem[]>(`${ENDPOINTS.TEMPLATES}`),
  getById: (id: number) => apiClient.get<TemplateResponse>(`${ENDPOINTS.TEMPLATES}/${id}`),
  create: (data: CreateTemplateRequest) => apiClient.post<TemplateResponse>(ENDPOINTS.TEMPLATES, data),
  update: (id: number, data: UpdateTemplateRequest) => apiClient.put<TemplateResponse>(`${ENDPOINTS.TEMPLATES}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${ENDPOINTS.TEMPLATES}/${id}`),
}
