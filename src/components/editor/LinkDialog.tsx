import { useState, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface LinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor
}

function LinkDialog({ open, onOpenChange, editor }: LinkDialogProps) {
  const [url, setUrl] = useState('')

  const existingHref = editor.getAttributes('link').href as string | undefined
  const hasExistingLink = Boolean(existingHref)

  useEffect(() => {
    if (open) {
      setUrl(existingHref ?? '')
    }
  }, [open, existingHref])

  function handleApply() {
    if (!url.trim()) return

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.trim() })
      .run()

    onOpenChange(false)
  }

  function handleRemove() {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    onOpenChange(false)
  }

  function handleCancel() {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inserir link</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2">
          <label htmlFor="link-url" className="text-sm font-medium">
            URL
          </label>
          <Input
            id="link-url"
            type="url"
            placeholder="https://exemplo.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleApply()
              }
            }}
          />
        </div>

        <DialogFooter>
          {hasExistingLink && (
            <Button variant="destructive" onClick={handleRemove}>
              Remover
            </Button>
          )}
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleApply} disabled={!url.trim()}>
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { LinkDialog }
