import { useEffect, useRef } from 'react'
import type { JSONContent } from '@tiptap/react'
import { useEditor, EditorContent } from '@tiptap/react'
import { getEditorExtensions } from './editorExtensions'
import { EditorToolbar } from './EditorToolbar'
import { EDITOR } from '@/config/constants'
import './editor.css'

interface RichTextEditorProps {
  content: JSONContent | null
  onChange: (content: JSONContent) => void
}

function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const contentLoaded = useRef(false)

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

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none"
        style={{ minHeight: `${EDITOR.MIN_HEIGHT}px` }}
      />
    </div>
  )
}

export { RichTextEditor }
