import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { usePage, useDeletePage } from '@/hooks/usePages'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'

export function PageViewPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const navigate = useNavigate()
  const id = Number(pageId)
  const { data: page, isLoading } = usePage(id)
  const deletePageMutation = useDeletePage()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const confirmDelete = () => {
    const parentSpaceId = page?.spaceId
    deletePageMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Pagina excluida com sucesso')
        navigate(parentSpaceId ? `/spaces/${parentSpaceId}` : '/spaces')
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao excluir pagina')
      },
    })
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (!page) {
    return <p className="text-muted-foreground">Pagina nao encontrada.</p>
  }

  return (
    <div>
      <Link
        to={`/spaces/${page.spaceId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold font-heading truncate">{page.title}</h2>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/pages/${id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>
      {page.description && (
        <p className="text-muted-foreground mb-6 line-clamp-2">{page.description}</p>
      )}

      <div className="prose max-w-none">
        {page.content ? (
          <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
            {page.content}
          </pre>
        ) : (
          <p className="text-muted-foreground text-sm">Esta pagina ainda nao tem conteudo.</p>
        )}
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir pagina"
        description={`Tem certeza que deseja excluir a pagina "${page.title}"? Esta acao nao pode ser desfeita.`}
        onConfirm={confirmDelete}
        isPending={deletePageMutation.isPending}
      />
    </div>
  )
}
