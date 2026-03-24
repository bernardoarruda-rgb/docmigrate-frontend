import { memo } from 'react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { Trash2, GripVertical } from 'lucide-react'
import type { SpacerSize } from './SpacerExtension'
import { SPACER_HEIGHTS } from './SpacerExtension'
import { buildStyleObject } from './utils/styleUtils'

const SIZE_OPTIONS: { value: SpacerSize; label: string }[] = [
  { value: 'sm', label: 'P' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'G' },
  { value: 'xl', label: 'XG' },
]

function SpacerNodeComponent({ node, updateAttributes, deleteNode, editor }: NodeViewProps) {
  const size = (node.attrs.size || 'md') as SpacerSize
  const height = SPACER_HEIGHTS[size]
  const isEditable = editor.isEditable

  if (!isEditable) {
    return (
      <NodeViewWrapper>
        <div style={{ ...buildStyleObject(node.attrs), height: `${height}px` }} />
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className="my-2">
      <div
        className="relative group flex items-center justify-center border border-dashed border-transparent hover:border-border rounded transition-colors"
        style={{ ...buildStyleObject(node.attrs), height: `${height}px` }}
      >
        <div className="hidden group-hover:flex items-center gap-1 rounded-md border border-border shadow-md p-1" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={size}
            onChange={(e) => updateAttributes({ size: e.target.value })}
            className="h-7 text-xs rounded border bg-background px-1"
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Espaco {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={deleteNode}
            className="p-1 rounded hover:bg-destructive/10 text-destructive"
            title="Remover espacador"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export const SpacerNode = memo(SpacerNodeComponent)
