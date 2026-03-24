import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { VideoNode } from './VideoNode'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoBlock: {
      insertVideo: (attrs?: { src?: string }) => ReturnType
    }
  }
}

export const VideoExtension = Node.create({
  name: 'videoBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element: HTMLElement) => element.querySelector('source')?.getAttribute('src') ?? element.getAttribute('src'),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-src': attributes.src,
        }),
      },
      alt: {
        default: null,
        parseHTML: (element: HTMLElement) => element.dataset.alt,
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-alt': attributes.alt,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'video-block' }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNode)
  },

  addCommands() {
    return {
      insertVideo:
        (attrs = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'videoBlock',
            attrs: {
              src: null,
              alt: null,
              ...attrs,
            },
          })
        },
    }
  },
})
