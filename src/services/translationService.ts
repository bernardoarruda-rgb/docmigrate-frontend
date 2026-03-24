import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { TranslationListItem, TranslationResponse, UpdateTranslationRequest } from '@/types/translation'

export const translationKeys = {
  all: ['translations'] as const,
  list: (pageId: number) => [...translationKeys.all, 'list', pageId] as const,
  detail: (pageId: number, lang: string) => [...translationKeys.all, 'detail', pageId, lang] as const,
}

export const translationService = {
  getAll: (pageId: number) =>
    apiClient.get<TranslationListItem[]>(ENDPOINTS.TRANSLATIONS(pageId)),

  get: (pageId: number, lang: string) =>
    apiClient.get<TranslationResponse>(ENDPOINTS.TRANSLATION(pageId, lang)),

  generate: (pageId: number, lang: string) =>
    apiClient.post<TranslationResponse>(ENDPOINTS.TRANSLATION(pageId, lang), {}),

  update: (pageId: number, lang: string, data: UpdateTranslationRequest) =>
    apiClient.put<TranslationResponse>(ENDPOINTS.TRANSLATION(pageId, lang), data),

  delete: (pageId: number, lang: string) =>
    apiClient.delete(ENDPOINTS.TRANSLATION(pageId, lang)),
}
