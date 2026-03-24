import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronRight, FileText, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconRenderer } from '@/components/ui/IconRenderer'
import type { PageTreeNode } from '@/lib/buildPageTree'

interface PageTreeItemProps {
  node: PageTreeNode
  spaceId: number
  canEdit: boolean
  onCreateSubPage: (parentPageId: number) => void
  activePageId: number | null
  depth?: number
}

export function PageTreeItem({
  node,
  spaceId,
  canEdit,
  onCreateSubPage,
  activePageId,
  depth = 0,
}: PageTreeItemProps) {
  const hasChildren = node.children.length > 0
  const isActive = node.id === activePageId
  const [expanded, setExpanded] = useState(isActive || hasChildren)

  return (
    <div>
      <div className="group flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => hasChildren && setExpanded(!expanded)}
          className={cn(
            'p-0.5 rounded shrink-0',
            hasChildren ? 'hover:bg-sidebar-accent cursor-pointer' : 'invisible',
          )}
        >
          <ChevronRight
            className={cn(
              'h-3 w-3 text-sidebar-foreground/40 transition-transform duration-200',
              expanded && 'rotate-90',
            )}
          />
        </button>

        <NavLink
          to={`/spaces/${spaceId}/pages/${node.id}`}
          className={({ isActive: navActive }) =>
            cn(
              'flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm flex-1 min-w-0 transition-colors',
              navActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )
          }
        >
          {node.icon ? (
            <IconRenderer icon={node.icon} iconColor={node.iconColor} size={14} className="shrink-0" />
          ) : (
            <FileText className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="truncate">{node.title}</span>
        </NavLink>

        {canEdit && node.level < 5 && (
          <button
            type="button"
            onClick={() => onCreateSubPage(node.id)}
            className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground shrink-0"
            title="Nova sub-pagina"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="ml-3 border-l border-sidebar-border/50 pl-1 flex flex-col gap-0.5 mt-0.5">
          {node.children.map((child) => (
            <PageTreeItem
              key={child.id}
              node={child}
              spaceId={spaceId}
              canEdit={canEdit}
              onCreateSubPage={onCreateSubPage}
              activePageId={activePageId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
