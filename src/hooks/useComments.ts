import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentService, commentKeys } from '@/services/commentService'
import type { CreateCommentRequest, UpdateCommentRequest } from '@/types/comment'

export function useComments(pageId: number) {
  return useQuery({
    queryKey: commentKeys.list(pageId),
    queryFn: () => commentService.getComments(pageId),
    enabled: pageId > 0,
  })
}

export function useCommentCount(pageId: number) {
  return useQuery({
    queryKey: commentKeys.count(pageId),
    queryFn: () => commentService.getCount(pageId),
    enabled: pageId > 0,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, data }: { pageId: number; data: CreateCommentRequest }) =>
      commentService.create(pageId, data),
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(pageId) })
      queryClient.invalidateQueries({ queryKey: commentKeys.count(pageId) })
    },
  })
}

export function useUpdateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, commentId, data }: { pageId: number; commentId: number; data: UpdateCommentRequest }) =>
      commentService.update(pageId, commentId, data),
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(pageId) })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, commentId }: { pageId: number; commentId: number }) =>
      commentService.delete(pageId, commentId),
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(pageId) })
      queryClient.invalidateQueries({ queryKey: commentKeys.count(pageId) })
    },
  })
}
