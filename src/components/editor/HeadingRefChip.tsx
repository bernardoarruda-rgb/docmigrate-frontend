import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { Hash, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { scrollToAndHighlight } from '@/lib/scrollToHeading'

interface HeadingRefChipProps extends NodeViewProps {
  isBroken?: boolean
}

function HeadingRefChip({ node, isBroken }: HeadingRefChipProps) {
  const navigate = useNavigate()
  const { id, label, pageId, pageTitle, spaceId } = node.attrs

  const displayText = pageTitle ? `${pageTitle} > ${label}` : label

  const handleClick = () => {
    if (isBroken) return
    if (pageId) {
      navigate(`/spaces/${spaceId}/pages/${pageId}#${id}`)
    } else {
      scrollToAndHighlight(id)
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
          <span>{displayText}</span>
        </span>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper as="span" className="inline">
      <span
        onClick={handleClick}
        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 bg-muted border border-border text-sm cursor-pointer hover:bg-accent/50 transition-colors"
      >
        <Hash className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span>{displayText}</span>
      </span>
    </NodeViewWrapper>
  )
}

export { HeadingRefChip }
