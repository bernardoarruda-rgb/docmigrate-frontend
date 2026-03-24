import { Link } from 'react-router-dom'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { IconRenderer } from '@/components/ui/IconRenderer'
import type { SpaceListItem } from '@/types/space'

interface SpaceCardProps {
  space: SpaceListItem
  onEdit: (space: SpaceListItem) => void
  onDelete: (space: SpaceListItem) => void
}

export function SpaceCard({ space, onEdit, onDelete }: SpaceCardProps) {
  return (
    <Card className="relative card-hover overflow-hidden group border border-border/60 rounded-xl transition-all hover:shadow-md">
      <Link to={`/spaces/${space.id}`} className="absolute inset-0 z-0" aria-label={`Ver espaco ${space.title}`} />
      
      <div
        className="absolute inset-x-0 top-0 h-1 transition-opacity"
        style={{
          backgroundColor: space.backgroundColor || 'var(--color-primary)',
          opacity: space.backgroundColor ? 1 : 0,
        }}
      />

      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              "h-8 w-8 hover:bg-background/80"
            )}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Acoes</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onEdit(space)
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onDelete(space)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="relative z-0 pointer-events-none">
        <div className="flex items-center gap-3 pr-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 shrink-0 text-primary">
            <IconRenderer icon={space.icon} iconColor={space.iconColor} size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg font-heading">{space.title}</CardTitle>
            {space.description && (
              <CardDescription className="line-clamp-2 mt-1 text-sm">{space.description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-0 pointer-events-none pb-4">
        <Badge variant="secondary" className="text-xs font-normal">
          {space.pageCount} {space.pageCount === 1 ? 'pagina' : 'paginas'}
        </Badge>
      </CardContent>
    </Card>
  )
}
