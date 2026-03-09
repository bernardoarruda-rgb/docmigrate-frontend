import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, MoreHorizontal, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useSpaces, useDeleteSpace } from '@/hooks/useSpaces'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SpaceFormDialog } from '@/components/spaces/SpaceFormDialog'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'
import type { SpaceListItem } from '@/types/space'

export function SpaceListPage() {
  const { data: spaces, isLoading, error } = useSpaces()
  const deleteMutation = useDeleteSpace()

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingSpace, setEditingSpace] = useState<SpaceListItem | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingSpace, setDeletingSpace] = useState<SpaceListItem | null>(null)

  const handleCreate = () => {
    setEditingSpace(null)
    setFormDialogOpen(true)
  }

  const handleEdit = (space: SpaceListItem) => {
    setEditingSpace(space)
    setFormDialogOpen(true)
  }

  const handleDeleteClick = (space: SpaceListItem) => {
    setDeletingSpace(space)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deletingSpace) return
    deleteMutation.mutate(deletingSpace.id, {
      onSuccess: () => {
        toast.success('Espaco excluido com sucesso')
        setDeleteDialogOpen(false)
        setDeletingSpace(null)
      },
      onError: (err) => {
        toast.error(err.message || 'Erro ao excluir espaco')
      },
    })
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold font-heading mb-6">Espacos</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Erro ao carregar espacos. Verifique se o backend esta rodando.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-heading">Espacos</h2>
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Novo espaco
        </Button>
      </div>

      {spaces && spaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mb-4" />
          <p className="text-lg">Nenhum espaco encontrado</p>
          <p className="text-sm">Crie um espaco para comecar a documentar.</p>
        </div>
      )}

      {spaces && spaces.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <Link key={space.id} to={`/spaces/${space.id}`}>
              <Card className="relative transition-colors hover:border-primary/50 cursor-pointer">
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e: React.MouseEvent) => e.preventDefault()}
                        />
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault()
                          handleEdit(space)
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault()
                          handleDeleteClick(space)
                        }}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardHeader>
                  <CardTitle className="truncate pr-8">{space.title}</CardTitle>
                  {space.description && (
                    <CardDescription className="line-clamp-2">{space.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">
                    {space.pageCount} {space.pageCount === 1 ? 'pagina' : 'paginas'}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <SpaceFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        space={editingSpace ?? undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir espaco"
        description={
          deletingSpace
            ? `Tem certeza que deseja excluir o espaco "${deletingSpace.title}"? Esta acao nao pode ser desfeita.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
