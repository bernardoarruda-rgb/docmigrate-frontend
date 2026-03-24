import { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  LayoutTemplate,
  Tag,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/hooks/useSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/hooks/usePermissions'
import { SpacesNav } from '@/components/layout/SpacesNav'
import { SpaceFormDialog } from '@/components/spaces/SpaceFormDialog'
import { SearchDialog } from '@/components/search/SearchDialog'
import { SIDEBAR } from '@/config/theme'

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar()
  const { logout, isIframe } = useAuth()
  const { canEdit } = usePermissions()
  const [searchOpen, setSearchOpen] = useState(false)
  const [spaceFormOpen, setSpaceFormOpen] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setSearchOpen(true)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden select-none',
        )}
        style={{ width: collapsed ? SIDEBAR.COLLAPSED_WIDTH : SIDEBAR.EXPANDED_WIDTH }}
      >
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 border-b border-sidebar-border px-4 shrink-0"
          style={{ height: 56 }}
        >
          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 shrink-0">
            <Home className="h-4 w-4 text-sidebar-primary" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-sidebar-primary truncate">
              DocMigrate
            </span>
          )}
        </NavLink>

        {/* Search */}
        <div className="px-2 pt-3 pb-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-2 w-full text-sm transition-colors',
              'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )}
          >
            <Search className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Buscar</span>
                <kbd className="text-[10px] text-sidebar-foreground/40 border border-sidebar-border rounded px-1 py-0.5">
                  Ctrl+K
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-1">
          {/* Inicio */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors mb-1',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
              )
            }
          >
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Inicio</span>}
          </NavLink>

          {/* Espacos section */}
          <div className="mt-3 mb-1">
            <div className="flex items-center justify-between px-2">
              {!collapsed && (
                <span className="text-[11px] font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                  Espacos
                </span>
              )}
              {collapsed ? (
                <FolderOpen className="h-4 w-4 text-sidebar-foreground/50 mx-auto" />
              ) : canEdit ? (
                <button
                  type="button"
                  onClick={() => setSpaceFormOpen(true)}
                  className="p-0.5 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
                  title="Novo espaco"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          <SpacesNav collapsed={collapsed} />

          {/* Templates & Tags (editor only) */}
          {canEdit && (
            <div className="mt-3">
              <NavLink
                to="/templates"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                  )
                }
              >
                <LayoutTemplate className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Templates</span>}
              </NavLink>
              <NavLink
                to="/tags"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                  )
                }
              >
                <Tag className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Tags</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-2 py-2 flex flex-col gap-1 shrink-0">
          {!isIframe && (
            <button
              type="button"
              onClick={logout}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-2 w-full text-sm transition-colors',
                'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sair</span>}
            </button>
          )}

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center justify-center rounded-md py-2 w-full transition-colors',
              'text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/50',
            )}
          >
            <div className="relative w-5 h-5">
              <ChevronLeft
                className={cn(
                  'w-5 h-5 absolute inset-0 transition-all duration-300',
                  collapsed ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100',
                )}
              />
              <ChevronRight
                className={cn(
                  'w-5 h-5 absolute inset-0 transition-all duration-300',
                  collapsed ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0',
                )}
              />
            </div>
          </button>
        </div>
      </aside>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <SpaceFormDialog open={spaceFormOpen} onOpenChange={setSpaceFormOpen} />
    </>
  )
}
