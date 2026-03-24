import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, Settings, Plus, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSpaces } from '@/hooks/useSpaces'
import { usePermissions } from '@/hooks/usePermissions'
import { IconRenderer } from '@/components/ui/IconRenderer'
import { usePages } from '@/hooks/usePages'
import { PageFormDialog } from '@/components/pages/PageFormDialog'
import { buildPageTree } from '@/lib/buildPageTree'
import { PageTreeItem } from '@/components/layout/PageTreeItem'
import type { SpaceListItem } from '@/types/space'

interface SpacesNavProps {
  collapsed: boolean
}

export function SpacesNav({ collapsed }: SpacesNavProps) {
  const { data } = useSpaces()
  const spaces = data?.items ?? []
  const location = useLocation()

  const spaceIdMatch = location.pathname.match(/\/spaces\/(\d+)/)
  const activeSpaceId = spaceIdMatch ? Number(spaceIdMatch[1]) : null

  if (collapsed) return null

  return (
    <div className="flex flex-col gap-0.5">
      {spaces.map((space) => (
        <SpaceItem
          key={space.id}
          space={space}
          autoExpand={space.id === activeSpaceId}
        />
      ))}
      {spaces.length === 0 && (
        <p className="px-3 py-2 text-xs text-sidebar-foreground/50">
          Nenhum espaco
        </p>
      )}
    </div>
  )
}

interface SpaceItemProps {
  space: SpaceListItem
  autoExpand: boolean
}

function SpaceItem({ space, autoExpand }: SpaceItemProps) {
  const [expanded, setExpanded] = useState(autoExpand)
  const { data: pages } = usePages(space.id)
  const { canEdit } = usePermissions()
  const navigate = useNavigate()
  const location = useLocation()
  const [pageFormOpen, setPageFormOpen] = useState(false)
  const [parentPageIdForCreate, setParentPageIdForCreate] = useState<number | null>(null)

  useEffect(() => {
    if (autoExpand) setExpanded(true)
  }, [autoExpand])

  const pageTree = pages ? buildPageTree([...pages].sort((a, b) => a.sortOrder - b.sortOrder)) : []

  const pageIdMatch = location.pathname.match(/\/pages\/(\d+)/)
  const activePageId = pageIdMatch ? Number(pageIdMatch[1]) : null

  return (
    <div>
      {/* Space header */}
      <div className="group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-sidebar-accent/50 transition-colors">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
        >
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50 transition-transform duration-200',
              expanded && 'rotate-90',
            )}
          />
          {space.icon ? (
            <IconRenderer icon={space.icon} iconColor={space.iconColor} size={16} className="shrink-0" />
          ) : (
            <FolderOpen className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
          )}
          <span className="truncate font-medium text-sidebar-foreground">
            {space.title}
          </span>
        </button>

        {/* Actions (visible on hover, editor only) */}
        {canEdit && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => setPageFormOpen(true)}
              className="p-0.5 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground"
              title="Nova pagina"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/spaces/${space.id}`)}
              className="p-0.5 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground"
              title="Gerenciar espaco"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Pages */}
      {expanded && (
        <div className="ml-3 border-l border-sidebar-border pl-1.5 flex flex-col gap-0.5 mt-0.5">
          {pageTree.map((node) => (
            <PageTreeItem
              key={node.id}
              node={node}
              spaceId={space.id}
              canEdit={canEdit}
              onCreateSubPage={(parentId) => {
                setParentPageIdForCreate(parentId)
                setPageFormOpen(true)
              }}
              activePageId={activePageId}
            />
          ))}
          {pageTree.length === 0 && (
            <p className="px-2 py-1 text-xs text-sidebar-foreground/40">
              Sem paginas
            </p>
          )}
        </div>
      )}

      <PageFormDialog
        open={pageFormOpen}
        onOpenChange={(open) => {
          setPageFormOpen(open)
          if (!open) setParentPageIdForCreate(null)
        }}
        spaceId={space.id}
        parentPageId={parentPageIdForCreate}
      />
    </div>
  )
}
