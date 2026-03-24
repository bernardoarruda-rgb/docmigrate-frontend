import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { templateService, templateKeys } from '@/services/templateService'
import type { CreateTemplateRequest, UpdateTemplateRequest } from '@/types/template'

export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: () => templateService.getAll(),
  })
}

export function useTemplate(id: number) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => templateService.getById(id),
    enabled: id > 0,
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templateService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all })
    },
  })
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTemplateRequest }) =>
      templateService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) })
    },
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => templateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all })
    },
  })
}
