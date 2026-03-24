import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import { Type, Highlighter, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { STYLE_BMS_PALETTE } from '@/config/editorStyles'

interface ToolbarColorPickerProps {
  editor: Editor
  type: 'textColor' | 'highlight'
}

function ToolbarColorPicker({ editor, type }: ToolbarColorPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isTextColor = type === 'textColor'
  const label = isTextColor ? 'Cor do texto' : 'Destaque'
  const Icon = isTextColor ? Type : Highlighter

  const activeColor = isTextColor
    ? (editor.getAttributes('textStyle').color as string | undefined)
    : (editor.getAttributes('highlight').color as string | undefined)

  const applyColor = (color: string) => {
    if (isTextColor) {
      editor.chain().focus().setColor(color).run()
    } else {
      editor.chain().focus().toggleHighlight({ color }).run()
    }
    setOpen(false)
  }

  const clearColor = () => {
    if (isTextColor) {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().unsetHighlight().run()
    }
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md h-8 w-8 text-sm font-medium hover:bg-accent transition-colors"
              onClick={() => setOpen((prev) => !prev)}
            >
              <span className="relative">
                <Icon className="h-4 w-4" />
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: activeColor ?? 'currentColor' }}
                />
              </span>
            </button>
          }
        />
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 rounded-lg border border-border bg-popover p-2 shadow-md min-w-[160px]">
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {STYLE_BMS_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                className="h-6 w-6 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => applyColor(color)}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <label className="flex items-center gap-1.5 flex-1 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
              Personalizada
              <input
                type="color"
                className="h-5 w-5 cursor-pointer rounded border-0 p-0"
                value={activeColor ?? '#000000'}
                onChange={(e) => applyColor(e.target.value)}
              />
            </label>

            {activeColor && (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={clearColor}
              >
                <X className="h-3 w-3" />
                Limpar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { ToolbarColorPicker }
