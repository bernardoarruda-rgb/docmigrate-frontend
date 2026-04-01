import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Home, FolderOpen, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useFolder, useDeleteFolder } from '@/hooks/useFolders'
import { useSpace } from '@/hooks/useSpaces'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FolderFormDialog } from '@/components/folders/FolderFormDialog'
import { PageFormDialog } from '@/components/pages/PageFormDialog'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePermissions } from '@/hooks/usePermissions'
import { IconRenderer } from '@/components/ui/IconRenderer'

export function FolderPreviewPage() {
  const { spaceId, folderId } = useParams<{ spaceId: string; folderId: string }>()
  const navigate = useNavigate()
  const sId = Number(spaceId)
  const fId = Number(folderId)

  const { data: folder, isLoading } = useFolder(fId)
  const { data: space } = useSpace(sId)
  const deleteMutation = useDeleteFolder(sId)
  const { canEdit } = usePermissions()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pageFormOpen, setPageFormOpen] = useState(false)

  useDocumentTitle(folder?.title ?? 'Pasta')

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
    )
  }

  if (!folder) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Pasta nao encontrada.</p>
      </div>
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(fId, {
      onSuccess: () => {
        toast.success('Pasta excluida com sucesso')
        navigate(`/spaces/${sId}`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao excluir pasta')
      },
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/spaces/${sId}`}>{space?.title ?? 'Espaco'}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {folder.breadcrumbs.map((bc) => (
            <span key={bc.id} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/spaces/${sId}/folders/${bc.id}`}>{bc.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </span>
          ))}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{folder.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {folder.icon ? (
            <IconRenderer icon={folder.icon} iconColor={folder.iconColor} size={28} />
          ) : (
            <FolderOpen className="h-7 w-7 text-muted-foreground" />
          )}
          <h1 className="text-2xl font-bold">{folder.title}</h1>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPageFormOpen(true)}>
              <FileText className="h-4 w-4 mr-1.5" />
              Nova pagina
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} title="Editar pasta">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)} title="Excluir pasta">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content info */}
      <div className="rounded-lg border p-6 text-center text-muted-foreground">
        <FolderOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-sm">
          Navegue pelas sub-pastas e paginas na barra lateral.
        </p>
      </div>

      {/* Dialogs */}
      <FolderFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        spaceId={sId}
        parentFolderId={folder.parentFolderId}
        folder={{ id: fId, title: folder.title, icon: folder.icon, iconColor: folder.iconColor }}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir pasta"
        description={`Tem certeza que deseja excluir a pasta "${folder.title}"? Sub-pastas e paginas dentro dela tambem serao afetadas.`}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
      <PageFormDialog
        open={pageFormOpen}
        onOpenChange={setPageFormOpen}
        spaceId={sId}
        folderId={fId}
      />
    </div>
  )
}
