import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { translationService, translationKeys } from '@/services/translationService'
import type { UpdateTranslationRequest } from '@/types/translation'

export function useTranslations(pageId: number) {
  return useQuery({
    queryKey: translationKeys.list(pageId),
    queryFn: () => translationService.getAll(pageId),
    enabled: pageId > 0,
  })
}

export function useTranslation(pageId: number, lang: string | null) {
  return useQuery({
    queryKey: translationKeys.detail(pageId, lang ?? ''),
    queryFn: () => translationService.get(pageId, lang!),
    enabled: pageId > 0 && lang !== null && lang !== 'pt-BR',
  })
}

export function useGenerateTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, lang }: { pageId: number; lang: string }) =>
      translationService.generate(pageId, lang),
    onSuccess: (_, { pageId, lang }) => {
      queryClient.invalidateQueries({ queryKey: translationKeys.list(pageId) })
      queryClient.invalidateQueries({ queryKey: translationKeys.detail(pageId, lang) })
    },
  })
}

export function useUpdateTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, lang, data }: { pageId: number; lang: string; data: UpdateTranslationRequest }) =>
      translationService.update(pageId, lang, data),
    onSuccess: (_, { pageId, lang }) => {
      queryClient.invalidateQueries({ queryKey: translationKeys.list(pageId) })
      queryClient.invalidateQueries({ queryKey: translationKeys.detail(pageId, lang) })
    },
  })
}

export function useDeleteTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, lang }: { pageId: number; lang: string }) =>
      translationService.delete(pageId, lang),
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: translationKeys.list(pageId) })
    },
  })
}
