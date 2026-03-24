import { useQuery } from '@tanstack/react-query'
import { referenceService, referenceQueryKeys } from '@/services/referenceService'

export function useCheckReferences(pageIds: number[], spaceIds: number[]) {
  const hasIds = pageIds.length > 0 || spaceIds.length > 0
  return useQuery({
    queryKey: referenceQueryKeys.check(pageIds, spaceIds),
    queryFn: () => referenceService.check({ pageIds, spaceIds }),
    enabled: hasIds,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePageHeadings(pageId: number | null) {
  return useQuery({
    queryKey: referenceQueryKeys.headings(pageId!),
    queryFn: () => referenceService.getPageHeadings(pageId!),
    enabled: pageId !== null && pageId > 0,
    staleTime: 60 * 1000,
  })
}
