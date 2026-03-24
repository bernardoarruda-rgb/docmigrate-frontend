import { apiClient } from '@/lib/apiClient'
import { SEARCH } from '@/config/endpoints'
import type { SearchResponse } from '@/types/search'

export const searchQueryKeys = {
  all: ['search'] as const,
  query: (q: string, filters?: { type?: string; spaceId?: number; tagIds?: number[] }) =>
    ['search', q, filters] as const,
}

export const searchService = {
  search: (query: string, filters?: { type?: string; spaceId?: number; tagIds?: number[] }) =>
    apiClient.get<SearchResponse>(SEARCH.search(query, filters)),
}
