import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pageService, pageKeys } from '@/services/pageService'
import type { CreatePageRequest, UpdatePageRequest } from '@/types/page'

export function usePages(spaceId: number) {
  return useQuery({
    queryKey: pageKeys.lists(spaceId),
    queryFn: async () => {
      const result = await pageService.getAll(spaceId)
      return result.items
    },
    enabled: spaceId > 0,
  })
}

export function usePage(id: number) {
  return useQuery({
    queryKey: pageKeys.detail(id),
    queryFn: () => pageService.getById(id),
    enabled: id > 0,
  })
}

export function useCreatePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePageRequest) => pageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.all })
    },
  })
}

export function useUpdatePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePageRequest }) =>
      pageService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.all })
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(variables.id) })
    },
  })
}

export function useDeletePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => pageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.all })
    },
  })
}

export function useReorderPages() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ spaceId, items }: { spaceId: number; items: Array<{ pageId: number; sortOrder: number }> }) =>
      pageService.reorder(spaceId, items),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists(variables.spaceId) })
    },
  })
}

export function usePageLockStatus(pageId: number) {
  return useQuery({
    queryKey: [...pageKeys.detail(pageId), 'lock'],
    queryFn: () => pageService.getLockStatus(pageId),
    enabled: pageId > 0,
  })
}

export function useAcquirePageLock() {
  return useMutation({
    mutationFn: (pageId: number) => pageService.acquireLock(pageId),
  })
}

export function useReleasePageLock() {
  return useMutation({
    mutationFn: (pageId: number) => pageService.releaseLock(pageId),
  })
}

export function useAutosavePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, content }: { pageId: number; content: string }) =>
      pageService.autosave(pageId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(variables.pageId) })
    },
  })
}

export function usePageBreadcrumbs(pageId: number) {
  return useQuery({
    queryKey: [...pageKeys.detail(pageId), 'breadcrumbs'],
    queryFn: () => pageService.getBreadcrumbs(pageId),
    enabled: pageId > 0,
  })
}
