export interface SpaceListItem {
  id: number
  title: string
  description: string | null
  pageCount: number
  createdAt: string
}

export interface SpaceResponse {
  id: number
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateSpaceRequest {
  title: string
  description?: string | null
}

export interface UpdateSpaceRequest {
  title: string
  description?: string | null
}
