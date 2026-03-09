import { NavLink } from 'react-router-dom'
import { Home, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SIDEBAR } from '@/config/theme'

interface SidebarProps {
  isCollapsed: boolean
}

const navItems = [
  { to: '/spaces', label: 'Espacos', icon: FolderOpen },
]

export function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <aside
      className="flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200"
      style={{ width: isCollapsed ? SIDEBAR.COLLAPSED_WIDTH : SIDEBAR.EXPANDED_WIDTH }}
    >
      <div className="flex h-14 items-center justify-center border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <span className="text-sm font-semibold text-sidebar-primary truncate">DocMigrate</span>
        )}
        {isCollapsed && (
          <Home className="h-5 w-5 text-sidebar-primary" />
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'hover:bg-sidebar-accent/50'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
