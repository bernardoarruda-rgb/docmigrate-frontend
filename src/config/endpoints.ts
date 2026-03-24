const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5029'

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  SPACES: `${API_BASE_URL}/api/spaces`,
  PAGES: `${API_BASE_URL}/api/pages`,
  PAGES_REORDER: (spaceId: number) => `${API_BASE_URL}/api/pages/reorder/${spaceId}`,
  PAGES_LOCK: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/lock`,
  PAGES_LOCK_STATUS: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/lock-status`,
  PAGES_AUTOSAVE: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/autosave`,
  PAGES_BREADCRUMBS: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/breadcrumbs`,
  TEMPLATES: `${API_BASE_URL}/api/templates`,
  FILES_ICONS: `${API_BASE_URL}/api/files/icons`,
  FILES_IMAGES: `${API_BASE_URL}/api/files/images`,
  FILES_VIDEOS: `${API_BASE_URL}/api/files/videos`,
  USER_PREFERENCES: `${API_BASE_URL}/api/user-preferences`,
  TAGS: `${API_BASE_URL}/api/tags`,
  PAGES_TAGS: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/tags`,
  SPACES_TAGS: (spaceId: number) => `${API_BASE_URL}/api/spaces/${spaceId}/tags`,
  PAGE_VERSIONS: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/versions`,
  PAGE_VERSION: (pageId: number, versionNumber: number) => `${API_BASE_URL}/api/pages/${pageId}/versions/${versionNumber}`,
  PAGE_VERSION_RESTORE: (pageId: number, versionNumber: number) => `${API_BASE_URL}/api/pages/${pageId}/versions/${versionNumber}/restore`,
  USER_FAVORITES: `${API_BASE_URL}/api/user/favorites`,
  USER_FAVORITE_CHECK: (pageId: number) => `${API_BASE_URL}/api/user/favorites/${pageId}/check`,
  USER_FAVORITE_TOGGLE: (pageId: number) => `${API_BASE_URL}/api/user/favorites/${pageId}/toggle`,
  USER_RECENT: `${API_BASE_URL}/api/user/recent`,
  USER_VISIT: (pageId: number) => `${API_BASE_URL}/api/user/visits/${pageId}`,
  PAGE_COMMENTS: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/comments`,
  PAGE_COMMENTS_COUNT: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/comments/count`,
  PAGE_COMMENT: (pageId: number, commentId: number) => `${API_BASE_URL}/api/pages/${pageId}/comments/${commentId}`,
  TRANSLATIONS: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/translations`,
  TRANSLATION: (pageId: number, lang: string) => `${API_BASE_URL}/api/pages/${pageId}/translations/${lang}`,
} as const

export const SEARCH = {
  search: (query: string, filters?: { type?: string; spaceId?: number; tagIds?: number[] }) => {
    const params = new URLSearchParams({ q: query })
    if (filters?.type && filters.type !== 'all') params.append('type', filters.type)
    if (filters?.spaceId) params.append('spaceId', String(filters.spaceId))
    if (filters?.tagIds?.length) filters.tagIds.forEach(id => params.append('tags', String(id)))
    return `${API_BASE_URL}/api/search?${params}`
  },
} as const

export const REFERENCES = {
  check: `${API_BASE_URL}/api/references/check`,
  pageHeadings: (pageId: number) => `${API_BASE_URL}/api/pages/${pageId}/headings`,
} as const
