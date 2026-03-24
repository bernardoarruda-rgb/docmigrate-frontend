import { useState } from 'react'
import { MessageSquare, Send, Reply, Pencil, Trash2, ChevronDown, ChevronUp, User } from 'lucide-react'
import { toast } from 'sonner'
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/useComments'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { CommentResponse } from '@/types/comment'

interface CommentsSectionProps {
  pageId: number
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function CommentItem({ comment, pageId, depth = 0, canEdit }: { comment: CommentResponse; pageId: number; depth?: number; canEdit: boolean }) {
  const [replying, setReplying] = useState(false)
  const [editing, setEditing] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [editText, setEditText] = useState(comment.content)
  const createComment = useCreateComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()

  const handleReply = () => {
    if (!replyText.trim()) return
    createComment.mutate(
      { pageId, data: { content: replyText.trim(), parentCommentId: comment.id } },
      {
        onSuccess: () => { setReplyText(''); setReplying(false); toast.success('Resposta adicionada') },
        onError: () => toast.error('Erro ao responder'),
      }
    )
  }

  const handleEdit = () => {
    if (!editText.trim()) return
    updateComment.mutate(
      { pageId, commentId: comment.id, data: { content: editText.trim() } },
      {
        onSuccess: () => { setEditing(false); toast.success('Comentario atualizado') },
        onError: () => toast.error('Erro ao editar'),
      }
    )
  }

  const handleDelete = () => {
    deleteComment.mutate(
      { pageId, commentId: comment.id },
      {
        onSuccess: () => toast.success('Comentario excluido'),
        onError: () => toast.error('Erro ao excluir'),
      }
    )
  }

  return (
    <div className={depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted">
            <User className="h-3 w-3 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">{comment.authorName ?? 'Usuario'}</span>
          <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          {comment.updatedAt !== comment.createdAt && (
            <span className="text-xs text-muted-foreground">(editado)</span>
          )}
        </div>

        {editing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEdit} disabled={updateComment.isPending || !editText.trim()}>
                Salvar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditText(comment.content) }}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
        )}

        {!editing && canEdit && (
          <div className="flex items-center gap-2 mt-1.5">
            {depth === 0 && (
              <button onClick={() => setReplying(!replying)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Reply className="h-3 w-3" /> Responder
              </button>
            )}
            <button onClick={() => setEditing(true)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Pencil className="h-3 w-3" /> Editar
            </button>
            <button onClick={handleDelete} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Excluir
            </button>
          </div>
        )}

        {replying && (
          <div className="mt-2 space-y-2 ml-8">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva uma resposta..."
              className="w-full rounded-lg border border-border bg-background p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReply} disabled={createComment.isPending || !replyText.trim()}>
                <Send className="h-3 w-3" /> Responder
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setReplying(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} pageId={pageId} depth={depth + 1} canEdit={canEdit} />
      ))}
    </div>
  )
}

export function CommentsSection({ pageId }: CommentsSectionProps) {
  const { data: comments, isLoading } = useComments(pageId)
  const createComment = useCreateComment()
  const { canEdit } = usePermissions()
  const [expanded, setExpanded] = useState(true)
  const [newComment, setNewComment] = useState('')

  const handleSubmit = () => {
    if (!newComment.trim()) return
    createComment.mutate(
      { pageId, data: { content: newComment.trim() } },
      {
        onSuccess: () => { setNewComment(''); toast.success('Comentario adicionado') },
        onError: () => toast.error('Erro ao adicionar comentario'),
      }
    )
  }

  const commentCount = comments?.reduce((acc, c) => acc + 1 + c.replies.length, 0) ?? 0

  return (
    <div className="mt-8 border-t border-border pt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-lg font-semibold mb-4 hover:text-primary transition-colors"
      >
        <MessageSquare className="h-5 w-5" />
        Comentarios {commentCount > 0 && `(${commentCount})`}
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <>
          {/* New comment form */}
          {canEdit && (
            <div className="mb-6 space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicionar um comentario..."
                className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSubmit} disabled={createComment.isPending || !newComment.trim()}>
                  <Send className="h-3.5 w-3.5" /> Comentar
                </Button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && (!comments || comments.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum comentario ainda. Seja o primeiro!
            </p>
          )}

          {comments && comments.length > 0 && (
            <div className="divide-y divide-border">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} pageId={pageId} canEdit={canEdit} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
