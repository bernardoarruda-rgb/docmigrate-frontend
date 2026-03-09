import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSpace, useDeleteSpace } from '@/hooks/useSpaces'
import { usePages, useDeletePage } from '@/hooks/usePages'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { PageFormDialog } from '@/components/pages/PageFormDialog'
import { SpaceFormDialog } from '@/components/spaces/SpaceFormDialog'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'
import type { PageListItem } from '@/types/page'

export function SpaceDetailPage() {
  const { spaceId } = useParams<{ spaceId: string }>()
  const navigate = useNavigate()
  const id = Number(spaceId)
  const { data: space, isLoading: spaceLoading } = useSpace(id)
  const { data: pages, isLoading: pagesLoading } = usePages(id)
  const deleteSpaceMutation = useDeleteSpace()
  const deletePageMutation = useDeletePage()

  const [spaceFormOpen, setSpaceFormOpen] = useState(false)
  const [spaceDeleteDialogOpen, setSpaceDeleteDialogOpen] = useState(false)

  const [pageFormOpen, setPageFormOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<PageListItem | undefined>(undefined)
  const [pageDeleteDialogOpen, setPageDeleteDialogOpen] = useState(false)
  const [deletingPage, setDeletingPage] = useState<PageListItem | undefined>(undefined)

  const handleDeleteSpace = () => {
    deleteSpaceMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Espaco excluido com sucesso')
        navigate('/spaces')
      },
      onError: (err) => {
        toast.error(err.message || 'Erro ao excluir espaco')
      },
    })
  }

  const handleEditPage = (page: PageListItem) => {
    setEditingPage(page)
    setPageFormOpen(true)
  }

  const handleNewPage = () => {
    setEditingPage(undefined)
    setPageFormOpen(true)
  }

  const handleDeletePage = (page: PageListItem) => {
    setDeletingPage(page)
    setPageDeleteDialogOpen(true)
  }

  const confirmDeletePage = () => {
    if (!deletingPage) return
    deletePageMutation.mutate(deletingPage.id, {
      onSuccess: () => {
        toast.success('Pagina excluida com sucesso')
        setPageDeleteDialogOpen(false)
        setDeletingPage(undefined)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao excluir pagina')
      },
    })
  }

  if (spaceLoading || pagesLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!space) {
    return <p className="text-muted-foreground">Espaco nao encontrado.</p>
  }

  return (
    <div>
      <Link to="/spaces" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="text-2xl font-bold font-heading truncate">{space.title}</h2>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setSpaceFormOpen(true)}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setSpaceDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </div>
      {space.description && (
        <p className="text-muted-foreground mb-6 line-clamp-2">{space.description}</p>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Paginas</h3>
        <Button size="sm" onClick={handleNewPage}>
          <Plus className="h-4 w-4" />
          Nova pagina
        </Button>
      </div>

      {pages && pages.length === 0 && (
        <p className="text-muted-foreground text-sm">Nenhuma pagina neste espaco.</p>
      )}

      {pages && pages.length > 0 && (
        <div className="space-y-3">
          {pages.map((page) => (
            <Card key={page.id} className="transition-colors hover:border-primary/50">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/pages/${page.id}`}
                    className="flex-1 min-w-0"
                  >
                    <CardTitle className="text-base truncate cursor-pointer hover:underline">
                      {page.title}
                    </CardTitle>
                    {page.description && (
                      <CardDescription className="line-clamp-1">{page.description}</CardDescription>
                    )}
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-xs" />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPage(page)}>
                          <Pencil className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeletePage(page)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <SpaceFormDialog
        open={spaceFormOpen}
        onOpenChange={setSpaceFormOpen}
        space={space}
      />

      <DeleteConfirmDialog
        open={spaceDeleteDialogOpen}
        onOpenChange={setSpaceDeleteDialogOpen}
        title="Excluir espaco"
        description={`Tem certeza que deseja excluir o espaco "${space.title}"? Esta acao nao pode ser desfeita.`}
        onConfirm={handleDeleteSpace}
        isPending={deleteSpaceMutation.isPending}
      />

      <PageFormDialog
        open={pageFormOpen}
        onOpenChange={setPageFormOpen}
        spaceId={id}
        page={editingPage}
      />

      <DeleteConfirmDialog
        open={pageDeleteDialogOpen}
        onOpenChange={setPageDeleteDialogOpen}
        title="Excluir pagina"
        description={
          deletingPage
            ? `Tem certeza que deseja excluir a pagina "${deletingPage.title}"? Esta acao nao pode ser desfeita.`
            : ''
        }
        onConfirm={confirmDeletePage}
        isPending={deletePageMutation.isPending}
      />
    </div>
  )
}
