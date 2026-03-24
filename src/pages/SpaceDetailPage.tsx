import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, FileUp, MoreHorizontal, Home } from 'lucide-react'
import { toast } from 'sonner'
import { useSpace, useDeleteSpace } from '@/hooks/useSpaces'
import { usePages, useDeletePage, useCreatePage } from '@/hooks/usePages'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SortablePageList } from '@/components/pages/SortablePageList'
import { PageFormDialog } from '@/components/pages/PageFormDialog'
import { SpaceFormDialog } from '@/components/spaces/SpaceFormDialog'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'
import { ImportFileDialog } from '@/components/import/ImportFileDialog'
import { ExportSpaceMenu } from '@/components/export/ExportSpaceMenu'
import { MetadataFooter } from '@/components/ui/MetadataFooter'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePermissions } from '@/hooks/usePermissions'
import type { PageListItem } from '@/types/page'

export function SpaceDetailPage() {
  const { spaceId } = useParams<{ spaceId: string }>()
  const navigate = useNavigate()
  const id = Number(spaceId)
  const { data: space, isLoading: spaceLoading } = useSpace(id)
  useDocumentTitle(space?.title)
  const { data: pages, isLoading: pagesLoading } = usePages(id)
  const { canEdit } = usePermissions()
  const deleteSpaceMutation = useDeleteSpace()
  const deletePageMutation = useDeletePage()
  const createPageMutation = useCreatePage()

  const [spaceFormOpen, setSpaceFormOpen] = useState(false)
  const [spaceDeleteDialogOpen, setSpaceDeleteDialogOpen] = useState(false)

  const [pageFormOpen, setPageFormOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<PageListItem | undefined>(undefined)
  const [pageDeleteDialogOpen, setPageDeleteDialogOpen] = useState(false)
  const [deletingPage, setDeletingPage] = useState<PageListItem | undefined>(undefined)
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  const handleDeleteSpace = () => {
    deleteSpaceMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Espaco excluido com sucesso')
        navigate('/')
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

  const handleImportPage = (title: string, content: string) => {
    createPageMutation.mutate(
      {
        title,
        content,
        sortOrder: (pages?.length ?? 0) + 1,
        spaceId: id,
      },
      {
        onSuccess: () => {
          toast.success('Pagina importada com sucesso')
          setImportDialogOpen(false)
        },
        onError: (err) => {
          toast.error(err.message || 'Erro ao criar pagina importada')
        },
      },
    )
  }

  if (spaceLoading || pagesLoading) {
    return (
      <div>
        <Skeleton className="h-4 w-16 mb-4" />
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-64 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!space) {
    return <p className="text-muted-foreground">Espaco nao encontrado.</p>
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{space.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-1">
        <h2 className="text-3xl font-bold font-heading truncate">{space.title}</h2>
        {canEdit && (
          <div className="flex items-center gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="icon-sm" />
                }
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSpaceFormOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  Editar espaco
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setSpaceDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir espaco
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      {space.description && (
        <p className="text-muted-foreground mb-6 line-clamp-2">{space.description}</p>
      )}

      <MetadataFooter
        createdByName={space.createdByName}
        createdAt={space.createdAt}
        updatedByName={space.updatedByName}
        updatedAt={space.updatedAt}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-semibold">
          Paginas
          {pages && pages.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({pages.length})
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <ExportSpaceMenu spaceId={id} spaceName={space.title} />
          {canEdit && (
            <>
              <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
                <FileUp className="h-4 w-4" />
                <span className="hidden sm:inline">Importar</span>
              </Button>
              <Button size="sm" onClick={handleNewPage}>
                <Plus className="h-4 w-4" />
                Nova pagina
              </Button>
            </>
          )}
        </div>
      </div>

      {pages && pages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground rounded-xl border border-dashed border-border">
          <p className="text-sm mb-3">Nenhuma pagina neste espaco.</p>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={handleNewPage}>
              <Plus className="h-4 w-4" />
              Criar primeira pagina
            </Button>
          )}
        </div>
      )}

      {pages && pages.length > 0 && (
        <SortablePageList
          pages={pages}
          spaceId={id}
          onView={(p) => navigate(`/spaces/${id}/pages/${p.id}`)}
          onEdit={canEdit ? handleEditPage : undefined}
          onDelete={canEdit ? handleDeletePage : undefined}
        />
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

      <ImportFileDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        mode="create"
        onPageCreate={handleImportPage}
      />
    </div>
  )
}
