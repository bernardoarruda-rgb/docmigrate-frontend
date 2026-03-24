export interface TagListItem {
  id: number
  name: string
  color: string | null
}

export interface TagResponse {
  id: number
  name: string
  color: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTagRequest {
  name: string
  color?: string | null
}

export interface UpdateTagRequest {
  name: string
  color?: string | null
}

export interface SetTagsRequest {
  tagIds: number[]
}
