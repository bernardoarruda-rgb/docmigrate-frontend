import { memo, useCallback, useState } from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { Check, Copy } from 'lucide-react'

const CodeBlockNode = memo(function CodeBlockNode({ node }: NodeViewProps) {
  const [copied, setCopied] = useState(false)
  const language = (node.attrs.language as string) || ''

  const handleCopy = useCallback(() => {
    const text = node.textContent
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [node])

  return (
    <NodeViewWrapper as="div" className="relative group my-3">
      {language && (
        <div className="absolute top-2 left-3 text-xs text-muted-foreground/70 font-mono select-none pointer-events-none">
          {language}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded-md bg-background/80 p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-accent text-muted-foreground hover:text-foreground"
        contentEditable={false}
        title="Copiar codigo"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
      <pre
        className="rounded-lg bg-muted/50 border border-border p-4 overflow-x-auto text-sm font-mono"
        spellCheck={false}
      >
        <NodeViewContent as="div" className="code-block-content" />
      </pre>
    </NodeViewWrapper>
  )
})

export { CodeBlockNode }
