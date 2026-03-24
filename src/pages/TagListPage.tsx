import { useState, useMemo } from 'react'
import { Tag, Plus, Search, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTags, useDeleteTag } from '@/hooks/useTags'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Skeleton } from '@/components/ui/skeleton'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TagFormDialog } from '@/components/tags/TagFormDialog'
import { TagBadge } from '@/components/tags/TagBadge'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'
import { usePermissions } from '@/hooks/usePermissions'
import type { TagListItem } from '@/types/tag'

export function TagListPage() {
  useDocumentTitle('Tags')
  const { data: tags, isLoading, error } = useTags()
  const deleteMutation = useDeleteTag()
  const { canEdit } = usePermissions()

  const [searchQuery, setSearchQuery] = useState('')
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagListItem | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingTag, setDeletingTag] = useState<TagListItem | null>(null)

  const tagList = tags ?? []

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tagList
    const q = searchQuery.toLowerCase()
    return tagList.filter((t) => t.name.toLowerCase().includes(q))
  }, [tagList, searchQuery])

  const handleCreate = () => {
    setEditingTag(null)
    setFormDialogOpen(true)
  }

  const handleEdit = (tag: TagListItem) => {
    setEditingTag(tag)
    setFormDialogOpen(true)
  }

  const handleDeleteClick = (tag: TagListItem) => {
    setDeletingTag(tag)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deletingTag) return
    deleteMutation.mutate(deletingTag.id, {
      onSuccess: () => {
        toast.success('Tag excluida com sucesso')
        setDeleteDialogOpen(false)
        setDeletingTag(null)
      },
      onError: (err) => {
        toast.error(err.message || 'Erro ao excluir tag')
      },
    })
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Erro ao carregar tags. Verifique se o backend esta rodando.</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold font-heading">Tags</h2>
          {tagList.length > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {tagList.length} {tagList.length === 1 ? 'tag encontrada' : 'tags encontradas'}
            </p>
          )}
        </div>
        {canEdit && (
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4" />
            Nova tag
          </Button>
        )}
      </div>

      {tagList.length > 3 && (
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-sm"
          />
        </div>
      )}

      {tagList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-muted mb-4">
            <Tag className="h-10 w-10" />
          </div>
          <p className="text-lg font-medium text-foreground">Nenhuma tag encontrada</p>
          <p className="text-sm mt-1 mb-4">Crie tags para organizar suas paginas e espacos.</p>
          {canEdit && (
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4" />
              Criar primeira tag
            </Button>
          )}
        </div>
      )}

      {filteredTags.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="group flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
            >
              <TagBadge tag={tag} />
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0',
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(tag)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(tag)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      )}

      {searchQuery && filteredTags.length === 0 && tagList.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Search className="h-8 w-8 mb-3" />
          <p className="text-sm">Nenhuma tag encontrada para "{searchQuery}"</p>
        </div>
      )}

      <TagFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        tag={editingTag ?? undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir tag"
        description={
          deletingTag
            ? `Tem certeza que deseja excluir a tag "${deletingTag.name}"? Ela sera removida de todas as paginas e espacos.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
