export interface TemplateListItem {
  id: number
  title: string
  description: string | null
  icon: string | null
  isDefault: boolean
  sortOrder: number
}

export interface TemplateResponse {
  id: number
  title: string
  description: string | null
  icon: string | null
  content: string | null
  isDefault: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  createdByName: string | null
  updatedByName: string | null
}

export interface CreateTemplateRequest {
  title: string
  description?: string | null
  icon?: string | null
  content?: string | null
  sortOrder: number
}

export interface UpdateTemplateRequest {
  title: string
  description?: string | null
  icon?: string | null
  content?: string | null
  sortOrder: number
}
