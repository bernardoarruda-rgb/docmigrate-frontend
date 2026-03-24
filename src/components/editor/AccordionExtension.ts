import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AccordionItemNode } from './AccordionItemNode'
import { AccordionNode } from './AccordionNode'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    accordion: {
      insertAccordion: (itemCount?: number) => ReturnType
    }
  }
}

export const AccordionItemExtension = Node.create({
  name: 'accordionItem',
  content: 'block+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      title: {
        default: 'Titulo do item',
        parseHTML: (element: HTMLElement) => element.dataset.title || 'Titulo do item',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-title': attributes.title,
        }),
      },
      isOpen: {
        default: true,
        parseHTML: (element: HTMLElement) => element.dataset.open !== 'false',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-open': String(attributes.isOpen),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="accordion-item"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'accordion-item' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AccordionItemNode)
  },
})

export const AccordionExtension = Node.create({
  name: 'accordion',
  group: 'block',
  content: 'accordionItem+',
  defining: true,
  isolating: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="accordion"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'accordion',
        class: 'accordion-wrapper',
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AccordionNode)
  },

  addCommands() {
    return {
      insertAccordion:
        (itemCount = 3) =>
        ({ commands }) => {
          const items = Array.from({ length: itemCount }, (_, i) => ({
            type: 'accordionItem',
            attrs: { title: `Item ${i + 1}`, isOpen: i === 0 },
            content: [{ type: 'paragraph' }],
          }))
          return commands.insertContent({
            type: 'accordion',
            content: items,
          })
        },
    }
  },
})
