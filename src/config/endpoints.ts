const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5029'

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  SPACES: `${API_BASE_URL}/api/spaces`,
  PAGES: `${API_BASE_URL}/api/pages`,
} as const
