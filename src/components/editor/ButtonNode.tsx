import { memo, useState, useCallback } from 'react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { Trash2, Settings, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ButtonVariant, ButtonAlign } from './ButtonExtension'
import { buildStyleObject } from './utils/styleUtils'

function isInternalLink(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#')
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  outline: 'border-2 border-primary',
  ghost: '',
}

const VARIANT_INLINE_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: { color: 'var(--color-primary-foreground)', textDecoration: 'none' },
  outline: { color: 'var(--color-primary)', textDecoration: 'none' },
  ghost: { color: 'var(--color-primary)', textDecoration: 'underline' },
}

const ALIGN_CLASSES: Record<ButtonAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

function ButtonNodeComponent({ node, updateAttributes, deleteNode, editor }: NodeViewProps) {
  const text = node.attrs.text as string
  const href = node.attrs.href as string
  const variant = (node.attrs.variant || 'primary') as ButtonVariant
  const align = (node.attrs.align || 'left') as ButtonAlign
  const isEditable = editor.isEditable
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(text)
  const [editHref, setEditHref] = useState(href)

  const handleSave = () => {
    updateAttributes({ text: editText, href: editHref })
    setEditing(false)
  }

  const internal = isInternalLink(href)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (internal) {
        e.preventDefault()
        navigate(href)
      }
    },
    [href, internal, navigate],
  )

  const buttonClasses = `inline-flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${VARIANT_CLASSES[variant]}`

  if (!isEditable) {
    return (
      <NodeViewWrapper>
        <div className={`flex ${ALIGN_CLASSES[align]} my-4`} style={buildStyleObject(node.attrs)}>
          <a
            href={href}
            onClick={handleClick}
            {...(!internal && { target: '_blank', rel: 'noopener noreferrer' })}
            className={buttonClasses}
            style={VARIANT_INLINE_STYLES[variant]}
          >
            {text}
            {href && href !== '#' && !internal && (
              <ExternalLink className="h-3.5 w-3.5 opacity-50" />
            )}
          </a>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className="my-4">
      <div className={`flex ${ALIGN_CLASSES[align]} relative group`} style={buildStyleObject(node.attrs)}>
        <div className={buttonClasses + ' cursor-default'} style={VARIANT_INLINE_STYLES[variant]}>
          {text}
          {href && href !== '#' && <ExternalLink className="h-3.5 w-3.5 opacity-50" />}
        </div>

        <div className="absolute -top-9 left-0 hidden group-hover:flex items-center gap-1 rounded-md border border-border shadow-md p-1 z-10" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
          <button
            type="button"
            onClick={() => {
              setEditText(text)
              setEditHref(href)
              setEditing(!editing)
            }}
            className="p-1 rounded hover:bg-accent"
            title="Editar botao"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={deleteNode}
            className="p-1 rounded hover:bg-destructive/10 text-destructive"
            title="Remover botao"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-2 p-3 rounded-md border shadow-md space-y-2" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Texto do botao"
              className="flex-1 h-8 px-2 text-sm rounded border bg-background"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <input
              type="url"
              value={editHref}
              onChange={(e) => setEditHref(e.target.value)}
              placeholder="https://..."
              className="flex-1 h-8 px-2 text-sm rounded border bg-background"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 text-xs rounded bg-primary text-primary-foreground"
            >
              Aplicar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-1 text-xs rounded border hover:bg-accent"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}

export const ButtonNode = memo(ButtonNodeComponent)
