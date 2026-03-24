import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SectionNode } from './SectionNode'

export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'
export type SectionLayout = 'flow' | 'grid'
export type SectionGridGap = 'sm' | 'md' | 'lg'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      insertSection: (attrs?: {
        backgroundColor?: string
        textColor?: string
        paddingY?: SectionPadding
        layout?: SectionLayout
        gridColumns?: number
        gridGap?: SectionGridGap
      }) => ReturnType
    }
  }
}

export const SectionExtension = Node.create({
  name: 'section',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,
  draggable: true,

  addAttributes() {
    return {
      backgroundColor: {
        default: null,
        parseHTML: (element: HTMLElement) => element.dataset.bgColor || null,
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes.backgroundColor) return {}
          return {
            'data-bg-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
      textColor: {
        default: null,
        parseHTML: (element: HTMLElement) => element.dataset.textColor || null,
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes.textColor) return {}
          return { 'data-text-color': attributes.textColor }
        },
      },
      paddingY: {
        default: 'md',
        parseHTML: (element: HTMLElement) => element.dataset.paddingY || 'md',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-padding-y': attributes.paddingY,
        }),
      },
      layout: {
        default: 'flow',
        parseHTML: (element: HTMLElement) => element.dataset.layout || 'flow',
        renderHTML: (attributes: Record<string, unknown>) => {
          const result: Record<string, string> = { 'data-layout': attributes.layout as string }
          if (attributes.layout === 'grid') {
            const cols = Number(attributes.gridColumns) || 3
            const gapMap: Record<string, string> = { sm: '0.5rem', md: '1rem', lg: '1.5rem' }
            const gap = gapMap[(attributes.gridGap as string) || 'md'] || '1rem'
            result.style = `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}`
          }
          return result
        },
      },
      gridColumns: {
        default: 3,
        parseHTML: (element: HTMLElement) => Number(element.dataset.gridColumns) || 3,
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-grid-columns': String(attributes.gridColumns),
        }),
      },
      gridGap: {
        default: 'md',
        parseHTML: (element: HTMLElement) => element.dataset.gridGap || 'md',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-grid-gap': attributes.gridGap as string,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="section"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'section' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionNode)
  },

  addCommands() {
    return {
      insertSection:
        (attrs = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'section',
            attrs,
            content: [{ type: 'paragraph' }],
          })
        },
    }
  },
})
