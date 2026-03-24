import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer, ReactRenderer } from '@tiptap/react'
import { computePosition, flip, shift, offset } from '@floating-ui/dom'
import { Suggestion } from '@tiptap/suggestion'
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
import { HeadingRefList } from './HeadingRefList'
import type { HeadingRefListHandle } from './HeadingRefList'
import { HeadingRefChip } from './HeadingRefChip'
import { slugify } from './HeadingIdExtension'
import type { HeadingDto } from '@/types/reference'

function getHeadingsFromEditor(editor: { state: { doc: { descendants: (cb: (node: { type: { name: string }; textContent: string; attrs: { level?: number } }) => void) => void } } }): HeadingDto[] {
  const headings: HeadingDto[] = []
  const slugCounts = new Map<string, number>()

  editor.state.doc.descendants((node) => {
    if (node.type.name === 'heading') {
      const text = node.textContent
      if (text) {
        const baseSlug = slugify(text)
        const count = slugCounts.get(baseSlug) ?? 0
        const id = count === 0 ? baseSlug : `${baseSlug}-${count}`
        slugCounts.set(baseSlug, count + 1)
        headings.push({
          id,
          text,
          level: node.attrs.level ?? 2,
        })
      }
    }
  })

  return headings
}

export const HeadingRefExtension = Node.create({
  name: 'headingRef',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
      pageId: { default: null },
      pageTitle: { default: null },
      spaceId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-heading-ref]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, 'data-heading-ref': '', class: 'heading-ref' }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeadingRefChip, { as: 'span', className: 'inline' })
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: new PluginKey('headingRefSuggestion'),
        editor: this.editor,
        char: '#',

        allow: ({ state, range }) => {
          // Block # at the very start of a block to avoid conflict with Markdown heading input rules
          const $from = state.doc.resolve(range.from)
          const offsetInParent = range.from - $from.start()
          return offsetInParent > 0
        },

        items: ({ editor, query }) => {
          const headings = getHeadingsFromEditor(editor as never)
          if (!query) return headings
          const normalizedQuery = query.toLowerCase()
          return headings.filter((h) =>
            h.text.toLowerCase().includes(normalizedQuery),
          )
        },

        command: ({ editor, range, props }) => {
          const heading = props as unknown as HeadingDto
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
              type: 'headingRef',
              attrs: {
                id: heading.id,
                label: heading.text,
                pageId: null,
                pageTitle: null,
                spaceId: null,
              },
            })
            .run()
        },

        render: () => {
          let component: ReactRenderer<HeadingRefListHandle> | null = null
          let floatingEl: HTMLDivElement | null = null

          async function updatePosition(
            clientRect: (() => DOMRect | null) | null | undefined,
          ) {
            if (!floatingEl || !clientRect) return
            const rect = clientRect()
            if (!rect) return

            const virtualEl = { getBoundingClientRect: () => rect }
            const { x, y } = await computePosition(virtualEl, floatingEl, {
              placement: 'bottom-start',
              middleware: [offset(8), flip(), shift({ padding: 8 })],
            })

            Object.assign(floatingEl.style, {
              left: `${x}px`,
              top: `${y}px`,
            })
          }

          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(HeadingRefList, {
                props: { items: props.items, command: props.command },
                editor: props.editor,
              })

              floatingEl = document.createElement('div')
              Object.assign(floatingEl.style, { position: 'absolute', zIndex: '50' })
              if (component.element) floatingEl.appendChild(component.element)
              document.body.appendChild(floatingEl)
              updatePosition(props.clientRect)
            },

            onUpdate: (props: SuggestionProps) => {
              component?.updateProps({
                items: props.items,
                command: props.command,
              })
              updatePosition(props.clientRect)
            },

            onKeyDown: (props: SuggestionKeyDownProps) => {
              if (props.event.key === 'Escape') return true
              return component?.ref?.onKeyDown(props) ?? false
            },

            onExit: () => {
              component?.destroy()
              floatingEl?.remove()
              component = null
              floatingEl = null
            },
          }
        },
      }),
    ]
  },
})
