import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/config/constants'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        aria-label="Alternar menu lateral"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold">{APP_NAME}</h1>
    </header>
  )
}
