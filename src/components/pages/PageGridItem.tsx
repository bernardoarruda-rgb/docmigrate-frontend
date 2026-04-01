import { Link } from 'react-router-dom'
import { Eye, Pencil, Copy, Trash2, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { IconRenderer } from '@/components/ui/IconRenderer'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { formatRelativeDate } from '@/lib/formatDate'
import { useDuplicatePage } from '@/hooks/usePages'
import type { PageListItem } from '@/types/page'

interface PageGridItemProps {
  page: PageListItem
  onView: (page: PageListItem) => void
  onEdit?: (page: PageListItem) => void
  onDelete?: (page: PageListItem) => void
}

export function PageGridItem({ page, onView, onEdit, onDelete }: PageGridItemProps) {
  const duplicatePage = useDuplicatePage()

  const handleDuplicate = () => {
    duplicatePage.mutate(page.id, {
      onSuccess: () => toast.success('Pagina duplicada com sucesso'),
      onError: () => toast.error('Erro ao duplicar pagina'),
    })
  }

  return (
    <Card className="relative group card-hover overflow-hidden">
      <Link
        to={`/spaces/${page.spaceId}/pages/${page.id}`}
        className="flex flex-col gap-3 p-4"
      >
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/8">
          <IconRenderer icon={page.icon} iconColor={page.iconColor} size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium truncate">{page.title}</h3>
          {page.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{page.description}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatRelativeDate(page.createdAt)}
        </span>
      </Link>

      <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoriteButton pageId={page.id} className="h-7 w-7" />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-xs" />}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(page)}>
              <Eye className="h-4 w-4" />
              Visualizar
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(page)}>
                <Pencil className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="h-4 w-4" />
              Duplicar
            </DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => onDelete(page)}>
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
