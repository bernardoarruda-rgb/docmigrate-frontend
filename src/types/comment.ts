export interface CommentResponse {
  id: number
  pageId: number
  content: string
  authorName: string | null
  authorId: number | null
  parentCommentId: number | null
  createdAt: string
  updatedAt: string
  replies: CommentResponse[]
}

export interface CreateCommentRequest {
  content: string
  parentCommentId?: number | null
}

export interface UpdateCommentRequest {
  content: string
}
