import { Link } from 'react-router-dom'
import { MoreHorizontal, Pencil, Eye, Trash2 } from 'lucide-react'
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

interface PageCardProps {
  page: PageListItem
  onView: (page: PageListItem) => void
  onEdit: (page: PageListItem) => void
  onDelete: (page: PageListItem) => void
}

export function PageCard({ page, onView, onEdit, onDelete }: PageCardProps) {
  return (
    <Card className="relative card-hover overflow-hidden group">
      {page.backgroundColor && (
        <div
          className="absolute inset-y-0 left-0 w-1 rounded-l-xl"
          style={{ backgroundColor: page.backgroundColor }}
        />
      )}
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-3">
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
            <Button variant="ghost" size="icon-xs" onClick={() => onEdit(page)} aria-label="Editar">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
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
                <DropdownMenuItem onClick={() => onEdit(page)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(page)}
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
  )
}
