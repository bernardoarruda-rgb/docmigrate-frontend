import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pageVersionService, pageVersionKeys } from '@/services/pageVersionService'
import { pageKeys } from '@/services/pageService'

export function usePageVersions(pageId: number) {
  return useQuery({
    queryKey: pageVersionKeys.list(pageId),
    queryFn: () => pageVersionService.getVersions(pageId),
    enabled: pageId > 0,
  })
}

export function usePageVersion(pageId: number, versionNumber: number) {
  return useQuery({
    queryKey: pageVersionKeys.detail(pageId, versionNumber),
    queryFn: () => pageVersionService.getVersion(pageId, versionNumber),
    enabled: pageId > 0 && versionNumber > 0,
  })
}

export function useRestorePageVersion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, versionNumber }: { pageId: number; versionNumber: number }) =>
      pageVersionService.restoreVersion(pageId, versionNumber),
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: pageVersionKeys.list(pageId) })
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(pageId) })
    },
  })
}
