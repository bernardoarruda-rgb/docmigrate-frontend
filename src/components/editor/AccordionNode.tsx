import { memo } from 'react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { GripVertical, Trash2 } from 'lucide-react'
import { buildStyleObject } from './utils/styleUtils'

function AccordionNodeComponent({ node, deleteNode, editor }: NodeViewProps) {
  const isEditable = editor.isEditable

  return (
    <NodeViewWrapper className="my-4">
      <div className="relative group accordion-wrapper" style={buildStyleObject(node.attrs)}>
        {isEditable && (
          <div className="absolute -top-3 left-2 hidden group-hover:flex items-center gap-1 rounded-md border border-border shadow-md p-1 z-10" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
            <div
              data-drag-handle
              draggable="true"
              className="p-1 rounded hover:bg-accent cursor-grab active:cursor-grabbing"
              title="Arrastar acordeao"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>
            <span className="w-px h-4 bg-border" />
            <button
              type="button"
              onClick={deleteNode}
              className="p-1 rounded hover:bg-destructive/10 text-destructive"
              title="Remover acordeao"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  )
}

export const AccordionNode = memo(AccordionNodeComponent)
