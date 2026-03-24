import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userPreferenceService, userPreferenceKeys } from '@/services/userPreferenceService'
import { useAuth } from '@/contexts/AuthContext'
import type { UpdateUserPreferenceRequest } from '@/types/userPreference'

export function useUserPreferences() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: userPreferenceKeys.current(),
    queryFn: userPreferenceService.get,
    enabled: isAuthenticated,
  })
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserPreferenceRequest) => userPreferenceService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userPreferenceKeys.all })
    },
  })
}

export function useResetUserPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => userPreferenceService.reset(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userPreferenceKeys.all })
    },
  })
}
