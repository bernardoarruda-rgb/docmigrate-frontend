import type { TagListItem } from './tag'

export interface SearchResult {
  id: number
  title: string
  description: string | null
  type: 'space' | 'page'
  spaceId: number | null
  spaceTitle: string | null
  icon: string | null
  iconColor: string | null
  snippet: string | null
  rank: number
  tags: TagListItem[]
  language?: string | null
}

export interface SearchResponse {
  items: SearchResult[]
  totalCount: number
  limit: number
  offset: number
}

export type SearchTypeFilter = 'all' | 'space' | 'page'

export interface SearchFilters {
  type: SearchTypeFilter
  spaceId: number | null
  tagIds: number[]
}
