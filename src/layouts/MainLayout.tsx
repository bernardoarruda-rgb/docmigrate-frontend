import { Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSidebar } from '@/hooks/useSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileWarning } from '@/components/ui/MobileWarning'
import { KeyboardShortcutsDialog } from '@/components/ui/KeyboardShortcutsDialog'
import { ScrollRestoration } from '@/components/ui/ScrollRestoration'

export function MainLayout() {
  const { sidebarWidth, hidden } = useSidebar()
  const { isIframe, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const location = useLocation()

  if (isIframe) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground" data-docmigrate-iframe="true">
        <ScrollRestoration />
        <main className="mx-auto max-w-[var(--content-max-width)] p-4 md:p-6">
          <div key={location.pathname} className="animate-in fade-in duration-150">
            <Outlet />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <MobileWarning />
      {!hidden && <Sidebar />}
      <ScrollRestoration />
      <main
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="min-h-screen px-6 py-6">
          <div key={location.pathname} className="animate-in fade-in duration-150">
            <Outlet />
          </div>
        </div>
      </main>
      <KeyboardShortcutsDialog />
    </div>
  )
}
