import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagService, tagKeys } from '@/services/tagService'
import type { CreateTagRequest, UpdateTagRequest } from '@/types/tag'

export function useTags() {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: () => tagService.getAll(),
  })
}

export function useTag(id: number) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagService.getById(id),
    enabled: id > 0,
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTagRequest) => tagService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagRequest }) =>
      tagService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(variables.id) })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
    },
  })
}

export function useSetPageTags() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, tagIds }: { pageId: number; tagIds: number[] }) =>
      tagService.setPageTags(pageId, { tagIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
    },
  })
}

export function useSetSpaceTags() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ spaceId, tagIds }: { spaceId: number; tagIds: number[] }) =>
      tagService.setSpaceTags(spaceId, { tagIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
    },
  })
}
