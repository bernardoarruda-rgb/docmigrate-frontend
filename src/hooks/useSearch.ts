import { useQuery } from '@tanstack/react-query'
import { searchService, searchQueryKeys } from '@/services/searchService'

export function useSearch(query: string, filters?: { type?: string; spaceId?: number; tagIds?: number[] }) {
  return useQuery({
    queryKey: searchQueryKeys.query(query, filters),
    queryFn: () => searchService.search(query, filters),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}
