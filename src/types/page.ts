export interface PageListItem {
  id: number
  title: string
  description: string | null
  sortOrder: number
  spaceId: number
  createdAt: string
}

export interface PageResponse {
  id: number
  title: string
  description: string | null
  content: string | null
  sortOrder: number
  spaceId: number
  createdAt: string
  updatedAt: string
}

export interface CreatePageRequest {
  title: string
  description?: string | null
  content?: string | null
  sortOrder: number
  spaceId: number
}

export interface UpdatePageRequest {
  title: string
  description?: string | null
  content?: string | null
  sortOrder: number
}
