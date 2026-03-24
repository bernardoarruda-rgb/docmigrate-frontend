import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { PageVersionListItem, PageVersionResponse } from '@/types/pageVersion'

export const pageVersionKeys = {
  all: ['pageVersions'] as const,
  list: (pageId: number) => [...pageVersionKeys.all, 'list', pageId] as const,
  detail: (pageId: number, versionNumber: number) =>
    [...pageVersionKeys.all, 'detail', pageId, versionNumber] as const,
}

export const pageVersionService = {
  getVersions: (pageId: number) =>
    apiClient.get<PageVersionListItem[]>(ENDPOINTS.PAGE_VERSIONS(pageId)),

  getVersion: (pageId: number, versionNumber: number) =>
    apiClient.get<PageVersionResponse>(ENDPOINTS.PAGE_VERSION(pageId, versionNumber)),

  restoreVersion: (pageId: number, versionNumber: number) =>
    apiClient.post<PageVersionResponse>(ENDPOINTS.PAGE_VERSION_RESTORE(pageId, versionNumber), {}),
}
