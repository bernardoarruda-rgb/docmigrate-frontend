import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { FileText, Layout, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageMentionChipProps extends NodeViewProps {
  isBroken?: boolean
}

function PageMentionChip({ node, isBroken }: PageMentionChipProps) {
  const navigate = useNavigate()
  const { id, label, referenceType, spaceId } = node.attrs

  const handleClick = () => {
    if (isBroken) return
    if (referenceType === 'page') {
      navigate(`/spaces/${spaceId}/pages/${id}`)
    } else {
      navigate(`/spaces/${id}`)
    }
  }

  if (isBroken) {
    return (
      <NodeViewWrapper as="span" className="inline">
        <span
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 bg-destructive/10 text-muted-foreground line-through text-sm cursor-default"
          title="Conteudo removido"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{label}</span>
        </span>
      </NodeViewWrapper>
    )
  }

  const Icon = referenceType === 'page' ? FileText : Layout

  return (
    <NodeViewWrapper as="span" className="inline">
      <span
        onClick={handleClick}
        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors"
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </span>
    </NodeViewWrapper>
  )
}

export { PageMentionChip }
