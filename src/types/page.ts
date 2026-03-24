export interface PageListItem {
  id: number
  title: string
  description: string | null
  icon: string | null
  iconColor: string | null
  backgroundColor: string | null
  sortOrder: number
  language: string
  spaceId: number
  createdAt: string
}

export interface PageResponse {
  id: number
  title: string
  description: string | null
  icon: string | null
  iconColor: string | null
  backgroundColor: string | null
  content: string | null
  sortOrder: number
  spaceId: number
  lockedBy: string | null
  lockedAt: string | null
  language: string
  createdAt: string
  updatedAt: string
  createdByName: string | null
  updatedByName: string | null
}

export interface PageLockStatus {
  isLocked: boolean
  lockedBy: string | null
}

export interface CreatePageRequest {
  title: string
  description?: string | null
  icon?: string | null
  iconColor?: string | null
  backgroundColor?: string | null
  content?: string | null
  language?: string
  sortOrder: number
  spaceId: number
}

export interface UpdatePageRequest {
  title: string
  description?: string | null
  icon?: string | null
  iconColor?: string | null
  backgroundColor?: string | null
  content?: string | null
  language?: string
  sortOrder: number
}
