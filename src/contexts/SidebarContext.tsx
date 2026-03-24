import { useState, useMemo, type ReactNode } from 'react'
import { SidebarContext } from './sidebarTypes'
import { SIDEBAR } from '@/config/theme'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [hidden, setHidden] = useState(false)

  const sidebarWidth = hidden ? 0 : collapsed ? SIDEBAR.COLLAPSED_WIDTH : SIDEBAR.EXPANDED_WIDTH

  const value = useMemo(
    () => ({ collapsed, setCollapsed, hidden, setHidden, sidebarWidth }),
    [collapsed, hidden, sidebarWidth],
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}
