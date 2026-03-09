import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { spaceService, spaceKeys } from '@/services/spaceService'
import type { CreateSpaceRequest, UpdateSpaceRequest } from '@/types/space'

export function useSpaces() {
  return useQuery({
    queryKey: spaceKeys.lists(),
    queryFn: spaceService.getAll,
  })
}

export function useSpace(id: number) {
  return useQuery({
    queryKey: spaceKeys.detail(id),
    queryFn: () => spaceService.getById(id),
    enabled: id > 0,
  })
}

export function useCreateSpace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSpaceRequest) => spaceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.lists() })
    },
  })
}

export function useUpdateSpace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSpaceRequest }) =>
      spaceService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: spaceKeys.detail(variables.id) })
    },
  })
}

export function useDeleteSpace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => spaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.lists() })
    },
  })
}
