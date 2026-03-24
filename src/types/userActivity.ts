export interface FavoritePageItem {
  pageId: number
  title: string
  description: string | null
  spaceId: number
  spaceTitle: string | null
  favoritedAt: string
}

export interface RecentPageItem {
  pageId: number
  title: string
  description: string | null
  spaceId: number
  spaceTitle: string | null
  visitedAt: string
}
