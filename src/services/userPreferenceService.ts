import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { UserPreferenceResponse, UpdateUserPreferenceRequest } from '@/types/userPreference'

export const userPreferenceKeys = {
  all: ['user-preferences'] as const,
  current: () => [...userPreferenceKeys.all, 'current'] as const,
}

export const userPreferenceService = {
  get: () => apiClient.get<UserPreferenceResponse>(ENDPOINTS.USER_PREFERENCES),
  update: (data: UpdateUserPreferenceRequest) =>
    apiClient.put<UserPreferenceResponse>(ENDPOINTS.USER_PREFERENCES, data),
  reset: () => apiClient.delete(ENDPOINTS.USER_PREFERENCES),
}
