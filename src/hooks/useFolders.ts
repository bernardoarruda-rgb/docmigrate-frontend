import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { folderService, folderKeys } from '@/services/folderService'
import type { CreateFolderRequest, UpdateFolderRequest } from '@/types/folder'

export function useFolders(spaceId: number) {
  return useQuery({
    queryKey: folderKeys.bySpace(spaceId),
    queryFn: () => folderService.getBySpace(spaceId),
    enabled: spaceId > 0,
  })
}

export function useFolder(id: number) {
  return useQuery({
    queryKey: folderKeys.detail(id),
    queryFn: () => folderService.getById(id),
    enabled: id > 0,
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFolderRequest) => folderService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.bySpace(variables.spaceId) })
    },
  })
}

export function useUpdateFolder(spaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFolderRequest }) =>
      folderService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.bySpace(spaceId) })
      queryClient.invalidateQueries({ queryKey: folderKeys.detail(variables.id) })
    },
  })
}

export function useDeleteFolder(spaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => folderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.bySpace(spaceId) })
    },
  })
}
