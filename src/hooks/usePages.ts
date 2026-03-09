import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pageService, pageKeys } from '@/services/pageService'
import type { CreatePageRequest, UpdatePageRequest } from '@/types/page'

export function usePages(spaceId: number) {
  return useQuery({
    queryKey: pageKeys.lists(spaceId),
    queryFn: () => pageService.getAll(spaceId),
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
