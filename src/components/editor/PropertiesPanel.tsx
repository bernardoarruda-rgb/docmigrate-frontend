import { useState, useEffect, useCallback } from 'react'
import type { Editor } from '@tiptap/core'
import { NodeSelection } from '@tiptap/pm/state'
import { X } from 'lucide-react'
import { StyleTab } from './properties/StyleTab'
import { LayoutTab } from './properties/LayoutTab'
import { BlockTab } from './properties/BlockTab'

type Tab = 'estilo' | 'layout' | 'bloco'

interface GridContext {
  columns: number
}

interface SelectedBlock {
  nodeType: string
  pos: number
  attrs: Record<string, unknown>
  gridContext: GridContext | null
}

function getParentGridContext(parentNode: { type: { name: string }; attrs: Record<string, unknown> } | null): GridContext | null {
  if (!parentNode) return null
  if (parentNode.type.name === 'section' && parentNode.attrs.layout === 'grid') {
    return { columns: Number(parentNode.attrs.gridColumns) || 3 }
  }
  return null
}

function resolveSelectedBlock(editor: Editor): SelectedBlock | null {
  const { selection } = editor.state

  if (selection instanceof NodeSelection) {
    const node = selection.node
    const $pos = editor.state.doc.resolve(selection.from)
    const parent = $pos.depth > 0 ? $pos.parent : null
    return {
      nodeType: node.type.name,
      pos: selection.from,
      attrs: { ...node.attrs },
      gridContext: getParentGridContext(parent),
    }
  }

  const { $from } = selection
  for (let depth = $from.depth; depth >= 1; depth--) {
    const node = $from.node(depth)
    if (node.isBlock) {
      const parent = depth > 1 ? $from.node(depth - 1) : null
      return {
        nodeType: node.type.name,
        pos: $from.before(depth),
        attrs: { ...node.attrs },
        gridContext: getParentGridContext(parent),
      }
    }
  }

  return null
}

interface PropertiesPanelProps {
  editor: Editor
  onClose: () => void
}

export function PropertiesPanel({ editor, onClose }: PropertiesPanelProps) {
  const [tab, setTab] = useState<Tab>('bloco')
  const [selected, setSelected] = useState<SelectedBlock | null>(null)

  const updateSelection = useCallback(() => {
    setSelected(resolveSelectedBlock(editor))
  }, [editor])

  useEffect(() => {
    updateSelection()
    editor.on('selectionUpdate', updateSelection)
    editor.on('transaction', updateSelection)
    return () => {
      editor.off('selectionUpdate', updateSelection)
      editor.off('transaction', updateSelection)
    }
  }, [editor, updateSelection])

  const updateAttr = useCallback(
    (key: string, value: unknown) => {
      if (!selected) return

      const { state } = editor
      const { selection } = state

      if (selection instanceof NodeSelection) {
        editor.chain().focus().updateAttributes(selected.nodeType, { [key]: value }).run()
      } else {
        const { $from } = selection
        for (let depth = $from.depth; depth >= 1; depth--) {
          const node = $from.node(depth)
          if (node.type.name === selected.nodeType) {
            const pos = $from.before(depth)
            const tr = state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              [key]: value,
            })
            editor.view.dispatch(tr)
            break
          }
        }
      }
    },
    [editor, selected],
  )

  const tabs: { key: Tab; label: string }[] = [
    { key: 'bloco', label: 'Bloco' },
    { key: 'estilo', label: 'Estilo' },
    { key: 'layout', label: 'Layout' },
  ]

  return (
    <div className="w-72 border-l border-border bg-background flex flex-col h-full shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="font-medium text-sm">Propriedades</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!selected ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            Selecione um bloco no editor para editar suas propriedades
          </p>
        </div>
      ) : (
        <>
          <div className="flex border-b border-border">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  tab === t.key
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {tab === 'bloco' && (
              <BlockTab
                editor={editor}
                nodeType={selected.nodeType}
                attrs={selected.attrs}
                updateAttr={updateAttr}
              />
            )}
            {tab === 'estilo' && (
              <StyleTab
                editor={editor}
                attrs={selected.attrs}
                updateAttr={(key, value) => updateAttr(key, value)}
              />
            )}
            {tab === 'layout' && (
              <LayoutTab
                editor={editor}
                attrs={selected.attrs}
                updateAttr={(key, value) => updateAttr(key, value)}
                gridContext={selected.gridContext}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
