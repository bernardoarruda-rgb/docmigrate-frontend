import { createContext } from 'react'

export interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  hidden: boolean
  setHidden: (value: boolean) => void
  sidebarWidth: number
}

export const SidebarContext = createContext<SidebarContextType | null>(null)
