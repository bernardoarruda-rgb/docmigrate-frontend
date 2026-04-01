import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type {
  FolderTreeItem,
  FolderResponse,
  CreateFolderRequest,
  UpdateFolderRequest,
  ReorderFoldersRequest,
} from '@/types/folder'

export const folderKeys = {
  all: ['folders'] as const,
  bySpace: (spaceId: number) => [...folderKeys.all, 'space', spaceId] as const,
  detail: (id: number) => [...folderKeys.all, 'detail', id] as const,
}

export const folderService = {
  getBySpace: (spaceId: number) =>
    apiClient.get<FolderTreeItem[]>(ENDPOINTS.FOLDERS_BY_SPACE(spaceId)),

  getById: (id: number) =>
    apiClient.get<FolderResponse>(`${ENDPOINTS.FOLDERS}/${id}`),

  create: (data: CreateFolderRequest) =>
    apiClient.post<FolderResponse>(ENDPOINTS.FOLDERS, data),

  update: (id: number, data: UpdateFolderRequest) =>
    apiClient.put<FolderResponse>(`${ENDPOINTS.FOLDERS}/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`${ENDPOINTS.FOLDERS}/${id}`),

  reorder: (spaceId: number, data: ReorderFoldersRequest) =>
    apiClient.put<void>(ENDPOINTS.FOLDERS_REORDER(spaceId), data),
}
