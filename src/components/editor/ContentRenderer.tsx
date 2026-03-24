import { createContext, useContext, useEffect, useMemo } from 'react'
import type { JSONContent } from '@tiptap/react'
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { Node } from '@tiptap/core'
import { getEditorExtensions } from './editorExtensions'
import { HeadingIdExtension } from './HeadingIdExtension'
import { useCheckReferences } from '@/hooks/useReferences'
import { useNavigate } from 'react-router-dom'
import { FileText, Layout, Hash, AlertTriangle } from 'lucide-react'
import { scrollToAndHighlight } from '@/lib/scrollToHeading'
import './editor.css'

// Context to provide broken ref state to NodeViews
interface BrokenRefState {
  brokenPageIds: Set<number>
  brokenSpaceIds: Set<number>
}

const BrokenRefContext = createContext<BrokenRefState>({
  brokenPageIds: new Set(),
  brokenSpaceIds: new Set(),
})

function extractReferenceIds(content: JSONContent): {
  pageIds: number[]
  spaceIds: number[]
} {
  const pageIdSet = new Set<number>()
  const spaceIdSet = new Set<number>()

  function walk(node: JSONContent) {
    if (node.type === 'pageMention' && node.attrs) {
      const parsed = parseInt(node.attrs.id, 10)
      if (!isNaN(parsed)) {
        if (node.attrs.referenceType === 'space') {
          spaceIdSet.add(parsed)
        } else {
          pageIdSet.add(parsed)
        }
      }
    }
    if (node.type === 'headingRef' && node.attrs?.pageId) {
      const parsed = parseInt(node.attrs.pageId, 10)
      if (!isNaN(parsed)) pageIdSet.add(parsed)
    }
    node.content?.forEach(walk)
  }

  walk(content)
  return {
    pageIds: Array.from(pageIdSet),
    spaceIds: Array.from(spaceIdSet),
  }
}

// Read-only NodeView for pageMention chips
function ReadOnlyPageMentionChip({ node }: NodeViewProps) {
  const navigate = useNavigate()
  const { brokenPageIds, brokenSpaceIds } = useContext(BrokenRefContext)
  const { id, label, referenceType, spaceId } = node.attrs

  const parsedId = parseInt(id, 10)
  const isBroken = referenceType === 'space'
    ? (isNaN(parsedId) || brokenSpaceIds.has(parsedId))
    : (isNaN(parsedId) || brokenPageIds.has(parsedId))

  const handleClick = () => {
    if (isBroken) return
    if (referenceType === 'page') navigate(`/spaces/${spaceId}/pages/${id}`)
    else navigate(`/spaces/${id}`)
  }

  if (isBroken) {
    return (
      <NodeViewWrapper as="span" className="inline">
        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 bg-destructive/10 text-muted-foreground line-through text-sm cursor-default" title="Conteudo removido">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{label}</span>
        </span>
      </NodeViewWrapper>
    )
  }

  const Icon = referenceType === 'page' ? FileText : Layout
  return (
    <NodeViewWrapper as="span" className="inline">
      <span onClick={handleClick} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </span>
    </NodeViewWrapper>
  )
}

// Read-only NodeView for headingRef chips
function ReadOnlyHeadingRefChip({ node }: NodeViewProps) {
  const navigate = useNavigate()
  const { brokenPageIds } = useContext(BrokenRefContext)
  const { id, label, pageId, pageTitle, spaceId } = node.attrs
  const displayText = pageTitle ? `${pageTitle} > ${label}` : label

  const parsedPageId = pageId ? parseInt(pageId, 10) : null
  const isBroken = parsedPageId !== null && (isNaN(parsedPageId) || brokenPageIds.has(parsedPageId))

  const handleClick = () => {
    if (isBroken) return
    if (pageId) navigate(`/spaces/${spaceId}/pages/${pageId}#${id}`)
    else scrollToAndHighlight(id)
  }

  if (isBroken) {
    return (
      <NodeViewWrapper as="span" className="inline">
        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 bg-destructive/10 text-muted-foreground line-through text-sm cursor-default" title="Conteudo removido">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{displayText}</span>
        </span>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper as="span" className="inline">
      <span onClick={handleClick} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 bg-muted border border-border text-sm cursor-pointer hover:bg-accent/50 transition-colors">
        <Hash className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span>{displayText}</span>
      </span>
    </NodeViewWrapper>
  )
}

// Read-only versions of the extensions with NodeView renderers for chips
const ReadOnlyPageMention = Node.create({
  name: 'pageMention',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
      referenceType: { default: 'page' },
      spaceId: { default: null },
    }
  },
  parseHTML() {
    return [{ tag: 'span[data-type="pageMention"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, 'data-type': 'pageMention' }]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ReadOnlyPageMentionChip)
  },
})

const ReadOnlyHeadingRef = Node.create({
  name: 'headingRef',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
      pageId: { default: null },
      pageTitle: { default: null },
      spaceId: { default: null },
    }
  },
  parseHTML() {
    return [{ tag: 'span[data-heading-ref]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, 'data-heading-ref': '' }]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ReadOnlyHeadingRefChip)
  },
})

interface ContentRendererProps {
  content: JSONContent
}

function ContentRenderer({ content }: ContentRendererProps) {
  const { pageIds, spaceIds } = useMemo(
    () => extractReferenceIds(content),
    [content],
  )

  const { data: refCheck } = useCheckReferences(pageIds, spaceIds)

  const brokenRefState = useMemo<BrokenRefState>(() => {
    if (!refCheck) {
      return { brokenPageIds: new Set(), brokenSpaceIds: new Set() }
    }
    const existingPageSet = new Set(refCheck.existingPageIds)
    const existingSpaceSet = new Set(refCheck.existingSpaceIds)
    return {
      brokenPageIds: new Set(pageIds.filter((id) => !existingPageSet.has(id))),
      brokenSpaceIds: new Set(spaceIds.filter((id) => !existingSpaceSet.has(id))),
    }
  }, [refCheck, pageIds, spaceIds])

  const editor = useEditor({
    extensions: [
      ...getEditorExtensions().filter(
        (ext) => ext.name !== 'pageMention' && ext.name !== 'headingRef',
      ),
      ReadOnlyPageMention,
      ReadOnlyHeadingRef,
      HeadingIdExtension,
    ],
    editable: false,
    content,
  })

  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(content)
  }, [editor, content])

  if (!editor) return null

  return (
    <BrokenRefContext.Provider value={brokenRefState}>
      <div className="prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    </BrokenRefContext.Provider>
  )
}

export { ContentRenderer }
