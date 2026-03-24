import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SpacerNode } from './SpacerNode'

export type SpacerSize = 'sm' | 'md' | 'lg' | 'xl'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spacer: {
      insertSpacer: (size?: SpacerSize) => ReturnType
    }
  }
}

export const SPACER_HEIGHTS: Record<SpacerSize, number> = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
}

export const SpacerExtension = Node.create({
  name: 'spacer',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      size: {
        default: 'md',
        parseHTML: (element: HTMLElement) => element.dataset.size || 'md',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-size': attributes.size,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="spacer"]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const size = node.attrs.size as SpacerSize
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'spacer',
        style: `height: ${SPACER_HEIGHTS[size] || 32}px`,
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SpacerNode)
  },

  addCommands() {
    return {
      insertSpacer:
        (size: SpacerSize = 'md') =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'spacer',
            attrs: { size },
          })
        },
    }
  },
})
