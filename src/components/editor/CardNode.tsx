import { memo } from 'react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { Trash2, GripVertical } from 'lucide-react'
import type { CardVariant } from './CardExtension'
import { buildStyleObject } from './utils/styleUtils'

const VARIANT_CLASSES: Record<CardVariant, string> = {
  bordered: 'border border-border bg-background',
  elevated: 'border border-border bg-background shadow-md',
  filled: 'border border-border bg-muted/50',
}

const VARIANT_LABELS: Record<CardVariant, string> = {
  bordered: 'Borda',
  elevated: 'Elevado',
  filled: 'Preenchido',
}

function CardNodeComponent({ node, updateAttributes, deleteNode, editor }: NodeViewProps) {
  const variant = (node.attrs.variant || 'bordered') as CardVariant
  const isEditable = editor.isEditable

  return (
    <NodeViewWrapper className="my-4">
      <div className={`relative group rounded-lg p-4 ${VARIANT_CLASSES[variant]} transition-shadow`} style={buildStyleObject(node.attrs)}>
        {isEditable && (
          <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 rounded-md border border-border shadow-md p-1 z-10" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
            <div
              data-drag-handle
              draggable="true"
              className="p-1 rounded hover:bg-accent cursor-grab active:cursor-grabbing"
              title="Arrastar card"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>
            <span className="w-px h-4 bg-border" />
            {(['bordered', 'elevated', 'filled'] as CardVariant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => updateAttributes({ variant: v })}
                className={`px-1.5 py-1 rounded text-xs ${variant === v ? 'bg-accent font-medium' : 'hover:bg-accent'}`}
              >
                {VARIANT_LABELS[v]}
              </button>
            ))}
            <span className="w-px h-4 bg-border" />
            <button
              type="button"
              onClick={deleteNode}
              className="p-1 rounded hover:bg-destructive/10 text-destructive"
              title="Remover card"
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

export const CardNode = memo(CardNodeComponent)
