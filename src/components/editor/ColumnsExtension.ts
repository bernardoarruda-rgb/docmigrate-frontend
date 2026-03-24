import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      insertColumns: (count: number) => ReturnType
    }
  }
}

export const ColumnExtension = Node.create({
  name: 'column',
  content: 'block+',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'column', class: 'column-item' }),
      0,
    ]
  },
})

export const ColumnsExtension = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column{2,4}',
  defining: true,
  isolating: true,
  draggable: true,

  addAttributes() {
    return {
      count: {
        default: 2,
        parseHTML: (element: HTMLElement) => parseInt(element.dataset.count || '2', 10),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-count': attributes.count,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
        class: `columns-layout columns-${node.attrs.count}`,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      insertColumns:
        (count: number) =>
        ({ commands }) => {
          const content = Array.from({ length: count }, () => ({
            type: 'column',
            content: [{ type: 'paragraph' }],
          }))
          return commands.insertContent({
            type: 'columns',
            attrs: { count },
            content,
          })
        },
    }
  },
})
