export interface SpaceListItem {
  id: number
  title: string
  description: string | null
  icon: string | null
  iconColor: string | null
  backgroundColor: string | null
  pageCount: number
  createdAt: string
}

export interface SpaceResponse {
  id: number
  title: string
  description: string | null
  icon: string | null
  iconColor: string | null
  backgroundColor: string | null
  createdAt: string
  updatedAt: string
  createdByName: string | null
  updatedByName: string | null
}

export interface CreateSpaceRequest {
  title: string
  description?: string | null
  icon?: string | null
  iconColor?: string | null
  backgroundColor?: string | null
}

export interface UpdateSpaceRequest {
  title: string
  description?: string | null
  icon?: string | null
  iconColor?: string | null
  backgroundColor?: string | null
}
