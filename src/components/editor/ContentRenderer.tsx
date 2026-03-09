import { useEffect } from 'react'
import type { JSONContent } from '@tiptap/react'
import { useEditor, EditorContent } from '@tiptap/react'
import { getEditorExtensions } from './editorExtensions'
import './editor.css'

interface ContentRendererProps {
  content: JSONContent
}

function ContentRenderer({ content }: ContentRendererProps) {
  const editor = useEditor({
    extensions: getEditorExtensions(),
    editable: false,
    content,
  })

  useEffect(() => {
    if (!editor) return

    editor.commands.setContent(content)
  }, [editor, content])

  if (!editor) return null

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}

export { ContentRenderer }
