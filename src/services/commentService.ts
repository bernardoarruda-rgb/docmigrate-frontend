import { apiClient } from '@/lib/apiClient'
import { ENDPOINTS } from '@/config/endpoints'
import type { CommentResponse, CreateCommentRequest, UpdateCommentRequest } from '@/types/comment'

export const commentKeys = {
  all: ['comments'] as const,
  list: (pageId: number) => [...commentKeys.all, 'list', pageId] as const,
  count: (pageId: number) => [...commentKeys.all, 'count', pageId] as const,
}

export const commentService = {
  getComments: (pageId: number) =>
    apiClient.get<CommentResponse[]>(ENDPOINTS.PAGE_COMMENTS(pageId)),
  getCount: (pageId: number) =>
    apiClient.get<{ count: number }>(ENDPOINTS.PAGE_COMMENTS_COUNT(pageId)),
  create: (pageId: number, data: CreateCommentRequest) =>
    apiClient.post<CommentResponse>(ENDPOINTS.PAGE_COMMENTS(pageId), data),
  update: (pageId: number, commentId: number, data: UpdateCommentRequest) =>
    apiClient.put<CommentResponse>(ENDPOINTS.PAGE_COMMENT(pageId, commentId), data),
  delete: (pageId: number, commentId: number) =>
    apiClient.delete(ENDPOINTS.PAGE_COMMENT(pageId, commentId)),
}
