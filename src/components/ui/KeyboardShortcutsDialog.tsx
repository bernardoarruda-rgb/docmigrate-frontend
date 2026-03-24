import { useEffect, useState } from 'react'
import { Keyboard } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ShortcutGroup {
  title: string
  shortcuts: { keys: string; description: string }[]
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Navegacao',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Busca rapida' },
      { keys: '?', description: 'Atalhos de teclado' },
    ],
  },
  {
    title: 'Formatacao',
    shortcuts: [
      { keys: 'Ctrl+B', description: 'Negrito' },
      { keys: 'Ctrl+I', description: 'Italico' },
      { keys: 'Ctrl+U', description: 'Sublinhado' },
      { keys: 'Ctrl+Shift+S', description: 'Tachado' },
      { keys: 'Ctrl+Z', description: 'Desfazer' },
      { keys: 'Ctrl+Shift+Z', description: 'Refazer' },
    ],
  },
  {
    title: 'Blocos (editor)',
    shortcuts: [
      { keys: '/', description: 'Menu de comandos' },
      { keys: 'Ctrl+Shift+1', description: 'Titulo 1' },
      { keys: 'Ctrl+Shift+2', description: 'Titulo 2' },
      { keys: 'Ctrl+Shift+3', description: 'Titulo 3' },
      { keys: 'Ctrl+Shift+8', description: 'Lista com marcadores' },
      { keys: 'Ctrl+Shift+9', description: 'Lista numerada' },
      { keys: 'Ctrl+Shift+B', description: 'Citacao' },
      { keys: 'Ctrl+Shift+E', description: 'Bloco de codigo' },
    ],
  },
]

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground min-w-[1.5rem]">
      {children}
    </kbd>
  )
}

function ShortcutKeys({ keys }: { keys: string }) {
  const parts = keys.split('+')
  return (
    <span className="flex items-center gap-0.5">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && (
            <span className="text-muted-foreground/50 text-xs">+</span>
          )}
          <Kbd>{part}</Kbd>
        </span>
      ))}
    </span>
  )
}

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Atalhos de teclado
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-2">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {group.title}
              </h3>
              <div className="space-y-1.5">
                {group.shortcuts.map((s) => (
                  <div
                    key={s.keys}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm">{s.description}</span>
                    <ShortcutKeys keys={s.keys} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
