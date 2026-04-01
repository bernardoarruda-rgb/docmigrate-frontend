import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, Settings, Plus, FolderOpen, FolderPlus, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useSpaces } from '@/hooks/useSpaces'
import { usePermissions } from '@/hooks/usePermissions'
import { IconRenderer } from '@/components/ui/IconRenderer'
import { usePages } from '@/hooks/usePages'
import { useFolders } from '@/hooks/useFolders'
import { PageFormDialog } from '@/components/pages/PageFormDialog'
import { FolderFormDialog } from '@/components/folders/FolderFormDialog'
import { buildPageTree } from '@/lib/buildPageTree'
import { PageTreeItem } from '@/components/layout/PageTreeItem'
import type { SpaceListItem } from '@/types/space'
import type { FolderTreeItem } from '@/types/folder'

interface SpacesNavProps {
  collapsed: boolean
}

export function SpacesNav({ collapsed }: SpacesNavProps) {
  const { data, isLoading } = useSpaces()
  const spaces = data?.items ?? []
  const location = useLocation()

  const spaceIdMatch = location.pathname.match(/\/spaces\/(\d+)/)
  const activeSpaceId = spaceIdMatch ? Number(spaceIdMatch[1]) : null

  if (collapsed) return null

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-2 py-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded shrink-0" />
            <Skeleton className="h-4 flex-1 rounded" />
          </div>
        ))}
      </div>
    )
  }

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
  const { data: folders } = useFolders(space.id)
  const { canEdit } = usePermissions()
  const navigate = useNavigate()
  const location = useLocation()
  const [pageFormOpen, setPageFormOpen] = useState(false)
  const [folderFormOpen, setFolderFormOpen] = useState(false)
  const [parentPageIdForCreate, setParentPageIdForCreate] = useState<number | null>(null)
  const [folderIdForCreatePage, setFolderIdForCreatePage] = useState<number | null>(null)

  useEffect(() => {
    if (autoExpand) setExpanded(true)
  }, [autoExpand])

  // Root-level pages (no folder)
  const rootPages = pages
    ? buildPageTree([...pages].filter((p) => !p.parentPageId).sort((a, b) => a.sortOrder - b.sortOrder))
    : []

  const pageIdMatch = location.pathname.match(/\/pages\/(\d+)/)
  const activePageId = pageIdMatch ? Number(pageIdMatch[1]) : null
  const folderIdMatch = location.pathname.match(/\/folders\/(\d+)/)
  const activeFolderId = folderIdMatch ? Number(folderIdMatch[1]) : null

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

        {canEdit && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => {
                setFolderIdForCreatePage(null)
                setPageFormOpen(true)
              }}
              className="p-0.5 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground"
              title="Nova pagina"
            >
              <FileText className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setFolderFormOpen(true)}
              className="p-0.5 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground"
              title="Nova pasta"
            >
              <FolderPlus className="h-3.5 w-3.5" />
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

      {/* Folders + Pages */}
      {expanded && (
        <div className="ml-3 border-l border-sidebar-border pl-1.5 flex flex-col gap-0.5 mt-0.5">
          {folders?.map((folder) => (
            <FolderTreeNode
              key={`f-${folder.id}`}
              folder={folder}
              spaceId={space.id}
              canEdit={canEdit}
              activePageId={activePageId}
              activeFolderId={activeFolderId}
              onCreatePage={(folderId) => {
                setFolderIdForCreatePage(folderId)
                setPageFormOpen(true)
              }}
              onCreateSubPage={(parentId) => {
                setParentPageIdForCreate(parentId)
                setFolderIdForCreatePage(null)
                setPageFormOpen(true)
              }}
            />
          ))}
          {rootPages.map((node) => (
            <PageTreeItem
              key={`p-${node.id}`}
              node={node}
              spaceId={space.id}
              canEdit={canEdit}
              onCreateSubPage={(parentId) => {
                setParentPageIdForCreate(parentId)
                setFolderIdForCreatePage(null)
                setPageFormOpen(true)
              }}
              activePageId={activePageId}
            />
          ))}
          {(!folders || folders.length === 0) && rootPages.length === 0 && (
            <p className="px-2 py-1 text-xs text-sidebar-foreground/40">
              Vazio
            </p>
          )}
        </div>
      )}

      <PageFormDialog
        open={pageFormOpen}
        onOpenChange={(open) => {
          setPageFormOpen(open)
          if (!open) {
            setParentPageIdForCreate(null)
            setFolderIdForCreatePage(null)
          }
        }}
        spaceId={space.id}
        parentPageId={parentPageIdForCreate}
        folderId={folderIdForCreatePage}
      />
      <FolderFormDialog
        open={folderFormOpen}
        onOpenChange={setFolderFormOpen}
        spaceId={space.id}
      />
    </div>
  )
}

/** Recursive folder tree node for the sidebar */
interface FolderTreeNodeProps {
  folder: FolderTreeItem
  spaceId: number
  canEdit: boolean
  activePageId: number | null
  activeFolderId: number | null
  onCreatePage: (folderId: number) => void
  onCreateSubPage: (parentPageId: number) => void
}

function FolderTreeNode({
  folder,
  spaceId,
  canEdit,
  activePageId,
  activeFolderId,
  onCreatePage,
  onCreateSubPage,
}: FolderTreeNodeProps) {
  const navigate = useNavigate()
  const isActive = activeFolderId === folder.id
  const [expanded, setExpanded] = useState(isActive)
  const [subFolderFormOpen, setSubFolderFormOpen] = useState(false)

  const hasChildren = folder.childFolders.length > 0 || folder.pages.length > 0
  const pageTree = buildPageTree([...folder.pages].sort((a, b) => a.sortOrder - b.sortOrder))

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 rounded-md px-2 py-1 text-sm cursor-pointer hover:bg-sidebar-accent/50 transition-colors',
          isActive && 'bg-sidebar-accent',
        )}
      >
        <button
          type="button"
          onClick={() => {
            setExpanded(!expanded)
            navigate(`/spaces/${spaceId}/folders/${folder.id}`)
          }}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
        >
          <ChevronRight
            className={cn(
              'h-3 w-3 shrink-0 text-sidebar-foreground/40 transition-transform duration-200',
              expanded && 'rotate-90',
              !hasChildren && 'invisible',
            )}
          />
          {folder.icon ? (
            <IconRenderer icon={folder.icon} iconColor={folder.iconColor} size={14} className="shrink-0" />
          ) : (
            <FolderOpen className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40" />
          )}
          <span className="truncate text-sidebar-foreground">{folder.title}</span>
        </button>

        {canEdit && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => onCreatePage(folder.id)}
              className="p-0.5 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground"
              title="Nova pagina nesta pasta"
            >
              <FileText className="h-3 w-3" />
            </button>
            {folder.level < 5 && (
              <button
                type="button"
                onClick={() => setSubFolderFormOpen(true)}
                className="p-0.5 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground"
                title="Nova sub-pasta"
              >
                <FolderPlus className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="ml-3 border-l border-sidebar-border pl-1.5 flex flex-col gap-0.5 mt-0.5">
          {folder.childFolders.map((child) => (
            <FolderTreeNode
              key={`f-${child.id}`}
              folder={child}
              spaceId={spaceId}
              canEdit={canEdit}
              activePageId={activePageId}
              activeFolderId={activeFolderId}
              onCreatePage={onCreatePage}
              onCreateSubPage={onCreateSubPage}
            />
          ))}
          {pageTree.map((node) => (
            <PageTreeItem
              key={`p-${node.id}`}
              node={node}
              spaceId={spaceId}
              canEdit={canEdit}
              onCreateSubPage={onCreateSubPage}
              activePageId={activePageId}
            />
          ))}
        </div>
      )}

      <FolderFormDialog
        open={subFolderFormOpen}
        onOpenChange={setSubFolderFormOpen}
        spaceId={spaceId}
        parentFolderId={folder.id}
      />
    </div>
  )
}
