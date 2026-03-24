import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { EmbedNode } from './EmbedNode'

export type EmbedAspectRatio = '16:9' | '4:3' | '1:1' | 'custom'
export type EmbedWidth = '100%' | '75%' | '50%'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embedBlock: {
      insertEmbed: (attrs?: {
        url?: string
        aspectRatio?: EmbedAspectRatio
        width?: EmbedWidth
        height?: number
      }) => ReturnType
    }
  }
}

export const EMBED_ASPECT_RATIOS: Record<Exclude<EmbedAspectRatio, 'custom'>, string> = {
  '16:9': '56.25%',
  '4:3': '75%',
  '1:1': '100%',
}

export const EMBED_DEFAULT_HEIGHT = 400

export const EmbedExtension = Node.create({
  name: 'embedBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      url: {
        default: '',
        parseHTML: (element: HTMLElement) => element.dataset.url || '',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-url': attributes.url,
        }),
      },
      aspectRatio: {
        default: '16:9',
        parseHTML: (element: HTMLElement) =>
          element.dataset.aspectRatio || '16:9',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-aspect-ratio': attributes.aspectRatio,
        }),
      },
      width: {
        default: '100%',
        parseHTML: (element: HTMLElement) =>
          element.dataset.width || '100%',
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-width': attributes.width,
        }),
      },
      height: {
        default: EMBED_DEFAULT_HEIGHT,
        parseHTML: (element: HTMLElement) =>
          Number(element.dataset.height) || EMBED_DEFAULT_HEIGHT,
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-height': attributes.height,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="embed-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'embed-block' }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedNode)
  },

  addCommands() {
    return {
      insertEmbed:
        (attrs = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'embedBlock',
            attrs: {
              url: '',
              aspectRatio: '16:9',
              width: '100%',
              height: EMBED_DEFAULT_HEIGHT,
              ...attrs,
            },
          })
        },
    }
  },
})
