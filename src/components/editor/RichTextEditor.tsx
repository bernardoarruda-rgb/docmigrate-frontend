import { useEffect, useRef, useState } from 'react'
import type { JSONContent } from '@tiptap/react'
import { useEditor, EditorContent } from '@tiptap/react'
import { getEditorExtensions } from './editorExtensions'
import { EditorToolbar } from './EditorToolbar'
import { BlockPanel } from './BlockPanel'
import { PropertiesPanel } from './PropertiesPanel'
import './editor.css'

type SidePanel = 'blocks' | 'properties' | null

interface RichTextEditorProps {
  content: JSONContent | null
  onChange: (content: JSONContent) => void
  pageTitle?: string
  pageContent?: string | null
}

function RichTextEditor({ content, onChange, pageTitle, pageContent }: RichTextEditorProps) {
  const contentLoaded = useRef(false)
  const [sidePanel, setSidePanel] = useState<SidePanel>(null)

  const editor = useEditor({
    extensions: getEditorExtensions(),
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON())
    },
  })

  useEffect(() => {
    if (!editor || contentLoaded.current || !content) return

    editor.commands.setContent(content)
    contentLoaded.current = true
  }, [editor, content])

  if (!editor) return null

  const togglePanel = (panel: SidePanel) => {
    setSidePanel((current) => (current === panel ? null : panel))
  }

  return (
    <div className="flex rounded-xl border border-border overflow-hidden h-full shadow-sm">
      <div className="flex-1 min-w-0 flex flex-col">
        <EditorToolbar
          editor={editor}
          pageTitle={pageTitle}
          pageContent={pageContent}
          blockPanelOpen={sidePanel === 'blocks'}
          propertiesPanelOpen={sidePanel === 'properties'}
          onToggleBlockPanel={() => togglePanel('blocks')}
          onTogglePropertiesPanel={() => togglePanel('properties')}
        />
        <div className="flex-1 min-h-0 overflow-y-auto bg-background">
          <div className="max-w-200 mx-auto">
            <EditorContent
              editor={editor}
              className="prose max-w-none"
            />
          </div>
        </div>
      </div>
      {sidePanel === 'blocks' && (
        <BlockPanel editor={editor} onClose={() => setSidePanel(null)} />
      )}
      {sidePanel === 'properties' && (
        <PropertiesPanel editor={editor} onClose={() => setSidePanel(null)} />
      )}
    </div>
  )
}

export { RichTextEditor }
