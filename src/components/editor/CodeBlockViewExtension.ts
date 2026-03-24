import { CodeBlock } from '@tiptap/extension-code-block'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CodeBlockNode } from './CodeBlockNode'

export const CodeBlockViewExtension = CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNode)
  },
})
