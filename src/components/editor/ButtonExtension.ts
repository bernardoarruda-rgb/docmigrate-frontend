import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ButtonNode } from './ButtonNode'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonAlign = 'left' | 'center' | 'right'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    buttonBlock: {
      insertButton: (attrs?: {
        text?: string
        href?: string
        variant?: ButtonVariant
        align?: ButtonAlign
      }) => ReturnType
    }
  }
}

export const ButtonExtension = Node.create({
  name: 'buttonBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      text: {
        default: 'Clique aqui',
        parseHTML: (element: HTMLElement) => element.dataset.text || 'Clique aqui',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-text': attributes.text,
        }),
      },
      href: {
        default: '#',
        parseHTML: (element: HTMLElement) => element.dataset.href || '#',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-href': attributes.href,
        }),
      },
      variant: {
        default: 'primary',
        parseHTML: (element: HTMLElement) => element.dataset.variant || 'primary',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-variant': attributes.variant,
        }),
      },
      align: {
        default: 'left',
        parseHTML: (element: HTMLElement) => element.dataset.align || 'left',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-align': attributes.align,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="button-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'button-block' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonNode)
  },

  addCommands() {
    return {
      insertButton:
        (attrs = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'buttonBlock',
            attrs: {
              text: 'Clique aqui',
              href: '#',
              variant: 'primary',
              align: 'left',
              ...attrs,
            },
          })
        },
    }
  },
})
