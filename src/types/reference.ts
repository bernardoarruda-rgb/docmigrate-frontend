export interface HeadingDto {
  id: string
  text: string
  level: number
}

export interface CheckReferencesRequest {
  pageIds: number[]
  spaceIds: number[]
}

export interface CheckReferencesResponse {
  existingPageIds: number[]
  existingSpaceIds: number[]
}

export type ReferenceType = 'page' | 'space'
