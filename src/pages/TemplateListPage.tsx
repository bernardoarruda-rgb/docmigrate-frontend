import { useState, useMemo } from 'react'
import { LayoutTemplate, Plus, Search, MoreHorizontal, Pencil, Trash2, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useTemplates, useDeleteTemplate } from '@/hooks/useTemplates'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
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
import { TemplateFormDialog } from '@/components/templates/TemplateFormDialog'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'
import { usePermissions } from '@/hooks/usePermissions'
import type { TemplateListItem } from '@/types/template'

export function TemplateListPage() {
  useDocumentTitle('Templates')
  const { data: templates, isLoading, error } = useTemplates()
  const deleteMutation = useDeleteTemplate()
  const { canEdit } = usePermissions()

  const [searchQuery, setSearchQuery] = useState('')
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TemplateListItem | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingTemplate, setDeletingTemplate] = useState<TemplateListItem | null>(null)

  const templateList = templates ?? []

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templateList
    const q = searchQuery.toLowerCase()
    return templateList.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q),
    )
  }, [templateList, searchQuery])

  const handleCreate = () => {
    setEditingTemplate(null)
    setFormDialogOpen(true)
  }

  const handleEdit = (template: TemplateListItem) => {
    setEditingTemplate(template)
    setFormDialogOpen(true)
  }

  const handleDeleteClick = (template: TemplateListItem) => {
    setDeletingTemplate(template)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deletingTemplate) return
    deleteMutation.mutate(deletingTemplate.id, {
      onSuccess: () => {
        toast.success('Template excluido com sucesso')
        setDeleteDialogOpen(false)
        setDeletingTemplate(null)
      },
      onError: (err) => {
        toast.error(err.message || 'Erro ao excluir template')
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full mt-2" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Erro ao carregar templates. Verifique se o backend esta rodando.</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold font-heading">Templates</h2>
          {templateList.length > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {templateList.length} {templateList.length === 1 ? 'template encontrado' : 'templates encontrados'}
            </p>
          )}
        </div>
        {canEdit && (
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4" />
            Novo template
          </Button>
        )}
      </div>

      {templateList.length > 3 && (
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-sm"
          />
        </div>
      )}

      {templateList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-muted mb-4">
            <LayoutTemplate className="h-10 w-10" />
          </div>
          <p className="text-lg font-medium text-foreground">Nenhum template encontrado</p>
          <p className="text-sm mt-1 mb-4">Crie um template para padronizar suas paginas.</p>
          {canEdit && (
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4" />
              Criar primeiro template
            </Button>
          )}
        </div>
      )}

      {filteredTemplates.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted shrink-0">
                    <LayoutTemplate className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{template.title}</h3>
                      {template.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary shrink-0">
                          <Star className="h-3 w-3" />
                          Padrao
                        </span>
                      )}
                    </div>
                    {template.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {template.description}
                      </p>
                    )}
                  </div>
                  {canEdit && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'icon' }),
                          'h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0',
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(template)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(template)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {template.icon && (
                    <span className="truncate">Icone: {template.icon}</span>
                  )}
                  <span>Ordem: {template.sortOrder}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchQuery && filteredTemplates.length === 0 && templateList.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Search className="h-8 w-8 mb-3" />
          <p className="text-sm">Nenhum template encontrado para "{searchQuery}"</p>
        </div>
      )}

      <TemplateFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        template={editingTemplate ?? undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir template"
        description={
          deletingTemplate
            ? `Tem certeza que deseja excluir o template "${deletingTemplate.title}"? Esta acao nao pode ser desfeita.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
