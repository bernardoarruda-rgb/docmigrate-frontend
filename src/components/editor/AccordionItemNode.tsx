import { memo, useState } from 'react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { ChevronRight, Trash2, Plus } from 'lucide-react'
import { buildStyleObject } from './utils/styleUtils'

function AccordionItemNodeComponent({ node, updateAttributes, deleteNode, editor, getPos }: NodeViewProps) {
  const title = node.attrs.title as string
  const attrIsOpen = node.attrs.isOpen as boolean
  const isEditable = editor.isEditable

  const [localOpen, setLocalOpen] = useState(attrIsOpen)
  const isOpen = isEditable ? attrIsOpen : localOpen

  const handleToggle = () => {
    if (isEditable) {
      updateAttributes({ isOpen: !isOpen })
    } else {
      setLocalOpen(!localOpen)
    }
  }

  const handleAddItemAfter = () => {
    const pos = getPos()
    if (typeof pos !== 'number') return
    const endPos = pos + node.nodeSize
    editor
      .chain()
      .focus()
      .insertContentAt(endPos, {
        type: 'accordionItem',
        attrs: { title: 'Novo item', isOpen: true },
        content: [{ type: 'paragraph' }],
      })
      .run()
  }

  return (
    <NodeViewWrapper>
      <div className="border-b border-border last:border-b-0" style={buildStyleObject(node.attrs)}>
        <div
          className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-accent/30 transition-colors select-none"
          onClick={handleToggle}
        >
          <ChevronRight
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          />
          {isEditable ? (
            <input
              type="text"
              value={title}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-transparent font-medium text-sm outline-none border-none p-0"
              placeholder="Titulo do item"
            />
          ) : (
            <span className="flex-1 font-medium text-sm">{title}</span>
          )}
          {isEditable && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md border border-border shadow-md p-0.5" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddItemAfter()
                }}
                className="p-1 rounded hover:bg-accent"
                title="Adicionar item"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteNode()
                }}
                className="p-1 rounded hover:bg-destructive/10 text-destructive"
                title="Remover item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        <div
          className="px-3 pb-3 overflow-hidden transition-all duration-200"
          style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0, padding: isOpen ? undefined : 0 }}
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export const AccordionItemNode = memo(AccordionItemNodeComponent)
