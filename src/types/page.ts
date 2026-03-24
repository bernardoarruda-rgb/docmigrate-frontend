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
  parentPageId: number | null
  level: number
  hasChildren: boolean
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
  parentPageId: number | null
  level: number
  breadcrumbs: BreadcrumbItem[]
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
  parentPageId?: number | null
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
  parentPageId?: number | null
}

export interface BreadcrumbItem {
  id: number
  title: string
}
