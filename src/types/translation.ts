export interface TranslationListItem {
  language: string
  status: string
  updatedAt: string
}

export interface TranslationResponse {
  id: number
  pageId: number
  language: string
  title: string
  description: string | null
  content: string | null
  status: string
  translatedByName: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateTranslationRequest {
  title: string
  description?: string | null
  content?: string | null
}
