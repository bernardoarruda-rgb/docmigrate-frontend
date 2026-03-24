import { useState, useRef, useEffect, useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import { PaintBucket, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { STYLE_BMS_PALETTE } from '@/config/editorStyles'

const STYLED_BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'section',
  'buttonBlock',
  'cardBlock',
  'callout',
  'accordion',
  'accordionItem',
  'spacer',
  'columns',
  'column',
])

function findNearestStyledBlock(editor: Editor) {
  const { $from } = editor.state.selection
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth)
    if (STYLED_BLOCK_TYPES.has(node.type.name)) {
      return { node, pos: $from.before(depth), depth }
    }
  }
  return null
}

interface ToolbarBlockColorPickerProps {
  editor: Editor
}

function ToolbarBlockColorPicker({ editor }: ToolbarBlockColorPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const block = findNearestStyledBlock(editor)
  const activeColor = (block?.node.attrs.styleBgColor as string | undefined) ?? undefined

  const applyColor = useCallback(
    (color: string) => {
      const target = findNearestStyledBlock(editor)
      if (!target) return
      const { tr } = editor.state
      tr.setNodeMarkup(target.pos, undefined, {
        ...target.node.attrs,
        styleBgColor: color,
      })
      editor.view.dispatch(tr)
      setOpen(false)
    },
    [editor],
  )

  const clearColor = useCallback(() => {
    const target = findNearestStyledBlock(editor)
    if (!target) return
    const { tr } = editor.state
    tr.setNodeMarkup(target.pos, undefined, {
      ...target.node.attrs,
      styleBgColor: null,
    })
    editor.view.dispatch(tr)
    setOpen(false)
  }, [editor])

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
                <PaintBucket className="h-4 w-4" />
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: activeColor ?? 'currentColor' }}
                />
              </span>
            </button>
          }
        />
        <TooltipContent>Cor de fundo do bloco</TooltipContent>
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
                value={activeColor ?? '#ffffff'}
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

export { ToolbarBlockColorPicker }
