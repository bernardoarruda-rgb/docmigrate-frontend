import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CardNode } from './CardNode'

export type CardVariant = 'bordered' | 'elevated' | 'filled'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    cardBlock: {
      insertCard: (attrs?: { variant?: CardVariant }) => ReturnType
    }
  }
}

export const CardExtension = Node.create({
  name: 'cardBlock',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,
  draggable: true,

  addAttributes() {
    return {
      variant: {
        default: 'bordered',
        parseHTML: (element: HTMLElement) => element.dataset.variant || 'bordered',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-variant': attributes.variant,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="card-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'card-block' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardNode)
  },

  addCommands() {
    return {
      insertCard:
        (attrs = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'cardBlock',
            attrs: { variant: 'bordered', ...attrs },
            content: [{ type: 'paragraph' }],
          })
        },
    }
  },
})
