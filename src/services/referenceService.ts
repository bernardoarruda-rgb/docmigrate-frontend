import { apiClient } from '@/lib/apiClient'
import { REFERENCES } from '@/config/endpoints'
import type { CheckReferencesRequest, CheckReferencesResponse, HeadingDto } from '@/types/reference'

export const referenceQueryKeys = {
  all: ['references'] as const,
  check: (pageIds: number[], spaceIds: number[]) =>
    ['references', 'check', pageIds, spaceIds] as const,
  headings: (pageId: number) =>
    ['references', 'headings', pageId] as const,
}

export const referenceService = {
  check: (request: CheckReferencesRequest) =>
    apiClient.post<CheckReferencesResponse>(REFERENCES.check, request),

  getPageHeadings: (pageId: number) =>
    apiClient.get<HeadingDto[]>(REFERENCES.pageHeadings(pageId)),
}
