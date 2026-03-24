import { memo } from 'react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { Trash2, LayoutGrid, Rows3, GripVertical } from 'lucide-react'
import type { SectionPadding, SectionLayout, SectionGridGap } from './SectionExtension'
import { buildStyleObject } from './utils/styleUtils'
import { GRID_GAP } from '@/config/editorStyles'
import type { GridGapKey } from '@/config/editorStyles'

const PADDING_CLASSES: Record<SectionPadding, string> = {
  none: '',
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-12',
  xl: 'py-16',
}

function SectionNodeComponent({ node, updateAttributes, deleteNode, editor }: NodeViewProps) {
  const backgroundColor = node.attrs.backgroundColor as string | null
  const textColor = node.attrs.textColor as string | null
  const paddingY = (node.attrs.paddingY || 'md') as SectionPadding
  const layout = (node.attrs.layout || 'flow') as SectionLayout
  const gridColumns = (node.attrs.gridColumns || 3) as number
  const gridGap = (node.attrs.gridGap || 'md') as SectionGridGap
  const isEditable = editor.isEditable
  const isGrid = layout === 'grid'

  const gridStyle: React.CSSProperties = isGrid
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: GRID_GAP[gridGap as GridGapKey]?.css || '1rem',
      }
    : {}

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={`relative group rounded-lg ${PADDING_CLASSES[paddingY]} px-6 ${isEditable ? 'border border-dashed border-transparent hover:border-border' : ''} transition-colors`}
        style={{
          ...buildStyleObject(node.attrs),
          ...gridStyle,
          backgroundColor: backgroundColor || undefined,
          color: textColor || undefined,
        }}
      >
        {isEditable && (
          <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 rounded-md border border-border shadow-md p-1 z-10" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
            <div
              data-drag-handle
              draggable="true"
              className="p-1 rounded hover:bg-accent cursor-grab active:cursor-grabbing"
              title="Arrastar secao"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>
            <span className="w-px h-4 bg-border" />
            <button
              type="button"
              onClick={() => updateAttributes({ layout: isGrid ? 'flow' : 'grid' })}
              className={`p-1 rounded ${isGrid ? 'bg-accent' : 'hover:bg-accent'}`}
              title={isGrid ? 'Modo fluxo' : 'Modo grid'}
            >
              {isGrid ? <Rows3 className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={deleteNode}
              className="p-1 rounded hover:bg-destructive/10 text-destructive"
              title="Remover secao"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <NodeViewContent className={isGrid && isEditable ? 'section-grid-content' : undefined} />
      </div>
    </NodeViewWrapper>
  )
}

export const SectionNode = memo(SectionNodeComponent)
