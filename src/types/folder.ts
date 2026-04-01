import type { PageListItem, BreadcrumbItem } from './page'

export interface FolderTreeItem {
  id: number
  spaceId: number
  title: string
  icon: string | null
  iconColor: string | null
  parentFolderId: number | null
  level: number
  sortOrder: number
  createdAt: string
  childFolders: FolderTreeItem[]
  pages: PageListItem[]
}

export interface FolderResponse {
  id: number
  spaceId: number
  title: string
  icon: string | null
  iconColor: string | null
  parentFolderId: number | null
  level: number
  sortOrder: number
  breadcrumbs: BreadcrumbItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateFolderRequest {
  title: string
  icon?: string | null
  iconColor?: string | null
  sortOrder: number
  spaceId: number
  parentFolderId?: number | null
}

export interface UpdateFolderRequest {
  title: string
  icon?: string | null
  iconColor?: string | null
  sortOrder: number
  parentFolderId?: number | null
}

export interface ReorderFoldersRequest {
  items: { id: number; sortOrder: number; parentFolderId: number | null }[]
}
