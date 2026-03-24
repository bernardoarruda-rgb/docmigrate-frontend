import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userActivityService, userActivityKeys } from '@/services/userActivityService'

export function useFavorites() {
  return useQuery({
    queryKey: userActivityKeys.favorites(),
    queryFn: () => userActivityService.getFavorites(),
  })
}

export function useIsFavorite(pageId: number) {
  return useQuery({
    queryKey: userActivityKeys.favoriteCheck(pageId),
    queryFn: () => userActivityService.isFavorite(pageId),
    enabled: pageId > 0,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pageId: number) => userActivityService.toggleFavorite(pageId),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: userActivityKeys.favorites() })
      queryClient.invalidateQueries({ queryKey: userActivityKeys.favoriteCheck(pageId) })
    },
  })
}

export function useRecentPages(limit = 10) {
  return useQuery({
    queryKey: userActivityKeys.recent(),
    queryFn: () => userActivityService.getRecent(limit),
  })
}

export function useRecordVisit() {
  return useMutation({
    mutationFn: (pageId: number) => userActivityService.recordVisit(pageId),
  })
}
