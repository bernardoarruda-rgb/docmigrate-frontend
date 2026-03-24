import { memo } from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { Info, AlertTriangle, CheckCircle2, XCircle, Trash2, GripVertical } from 'lucide-react'
import type { CalloutType } from './CalloutExtension'
import { buildStyleObject } from './utils/styleUtils'

const CALLOUT_CONFIG: Record<
  CalloutType,
  {
    icon: React.ComponentType<{ className?: string }>
    label: string
    borderClass: string
    bgClass: string
    iconClass: string
  }
> = {
  info: {
    icon: Info,
    label: 'Informacao',
    borderClass: 'border-blue-500',
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    iconClass: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Aviso',
    borderClass: 'border-amber-500',
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    iconClass: 'text-amber-500',
  },
  success: {
    icon: CheckCircle2,
    label: 'Sucesso',
    borderClass: 'bg-emerald-50 dark:bg-emerald-950/30',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
    iconClass: 'text-emerald-500',
  },
  error: {
    icon: XCircle,
    label: 'Erro',
    borderClass: 'border-red-500',
    bgClass: 'bg-red-50 dark:bg-red-950/30',
    iconClass: 'text-red-500',
  },
}

const CALLOUT_TYPES: CalloutType[] = ['info', 'warning', 'success', 'error']

const CalloutNode = memo(function CalloutNode({
  node,
  updateAttributes,
  deleteNode,
  editor,
}: NodeViewProps) {
  const type = (node.attrs.type as CalloutType) || 'info'
  const config = CALLOUT_CONFIG[type]
  const Icon = config.icon
  const isEditable = editor.isEditable

  return (
    <NodeViewWrapper
      as="div"
      className={`my-3 flex gap-3 rounded-lg border-l-4 p-4 ${config.borderClass} ${config.bgClass}`}
      style={buildStyleObject(node.attrs)}
    >
      <div className="flex shrink-0 flex-col items-center gap-2 pt-0.5">
        {isEditable && (
          <div
            data-drag-handle
            draggable="true"
            className="cursor-grab active:cursor-grabbing rounded hover:bg-accent/30 p-0.5"
            contentEditable={false}
            title="Arrastar callout"
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}
        <Icon className={`h-5 w-5 ${config.iconClass}`} />
        {isEditable && (
          <>
            <select
              value={type}
              onChange={(e) => updateAttributes({ type: e.target.value })}
              className="w-20 rounded border border-border bg-background px-1 py-0.5 text-xs"
              contentEditable={false}
            >
              {CALLOUT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CALLOUT_CONFIG[t].label}
                </option>
              ))}
            </select>
            <button
              onClick={deleteNode}
              className="rounded p-0.5 text-muted-foreground hover:text-destructive"
              contentEditable={false}
              title="Remover"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
      <NodeViewContent as="div" className="min-w-0 flex-1" />
    </NodeViewWrapper>
  )
})

export { CalloutNode }
