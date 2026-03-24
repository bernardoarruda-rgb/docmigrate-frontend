import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from 'react-router-dom'
import { GripVertical, MoreHorizontal, Pencil, Eye, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { IconRenderer } from '@/components/ui/IconRenderer'
import type { PageListItem } from '@/types/page'

interface SortablePageItemProps {
  page: PageListItem
  onView: (page: PageListItem) => void
  onEdit?: (page: PageListItem) => void
  onDelete?: (page: PageListItem) => void
}

export function SortablePageItem({ page, onView, onEdit, onDelete }: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="relative card-hover overflow-hidden group">
        {page.backgroundColor && (
          <div
            className="absolute inset-y-0 left-0 w-1 rounded-l-xl"
            style={{ backgroundColor: page.backgroundColor }}
          />
        )}
        <CardHeader className="py-3">
          <div className="flex items-center justify-between gap-3">
            {onEdit && (
              <button
                type="button"
                className="flex items-center justify-center h-8 w-8 shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                {...attributes}
                {...listeners}
                aria-label="Arrastar para reordenar"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            )}
            <Link
              to={`/spaces/${page.spaceId}/pages/${page.id}`}
              className="flex-1 min-w-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted shrink-0">
                  <IconRenderer icon={page.icon} iconColor={page.iconColor} size={16} />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base truncate cursor-pointer hover:text-primary transition-colors">
                    {page.title}
                  </CardTitle>
                  {page.description && (
                    <CardDescription className="line-clamp-1 text-xs">{page.description}</CardDescription>
                  )}
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon-xs" onClick={() => onView(page)} aria-label="Visualizar">
                <Eye className="h-3.5 w-3.5" />
              </Button>
              {onEdit && (
                <Button variant="ghost" size="icon-xs" onClick={() => onEdit(page)} aria-label="Editar">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              {(onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-xs" />
                    }
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
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete(page)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
