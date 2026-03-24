export interface PageVersionListItem {
  id: number
  versionNumber: number
  changeDescription: string | null
  createdByName: string | null
  createdAt: string
}

export interface PageVersionResponse {
  id: number
  pageId: number
  versionNumber: number
  content: string
  changeDescription: string | null
  createdByName: string | null
  createdAt: string
}
