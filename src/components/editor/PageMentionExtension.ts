import { ReactNodeViewRenderer, ReactRenderer } from '@tiptap/react'
import { computePosition, flip, shift, offset } from '@floating-ui/dom'
import Mention from '@tiptap/extension-mention'
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import { PageMentionChip } from './PageMentionChip'
import { PageMentionList } from './PageMentionList'
import type { PageMentionListHandle } from './PageMentionList'
import { HeadingRefList } from './HeadingRefList'
import { searchService } from '@/services/searchService'
import { referenceService } from '@/services/referenceService'
import { MENTION } from '@/config/constants'
import type { SearchResult } from '@/types/search'
import type { HeadingDto } from '@/types/reference'

export const PageMentionExtension = Mention.extend({
  name: 'pageMention',

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
      referenceType: { default: 'page' },
      spaceId: { default: null },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageMentionChip, { as: 'span', className: 'inline' })
  },
}).configure({
  HTMLAttributes: {
    class: 'page-mention',
  },
  suggestion: {
    char: '@',

    items: async ({ query }): Promise<SearchResult[]> => {
      if (query.length < MENTION.MIN_QUERY_LENGTH) return []

      await new Promise((resolve) => setTimeout(resolve, MENTION.DEBOUNCE_MS))

      try {
        const response = await searchService.search(query, { type: 'all' })
        return response.items.slice(0, MENTION.MAX_RESULTS)
      } catch {
        return []
      }
    },

    command: ({ editor, range, props: item }) => {
      const searchResult = item as unknown as SearchResult
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'pageMention',
          attrs: {
            id: String(searchResult.id),
            label: searchResult.title,
            referenceType: searchResult.type,
            spaceId: searchResult.spaceId ? String(searchResult.spaceId) : null,
          },
        })
        .run()

      // For pages (not spaces), trigger cross-doc heading selection
      if (searchResult.type === 'page') {
        const cursorPos = editor.view.coordsAtPos(editor.state.selection.from)
        const rect = new DOMRect(cursorPos.left, cursorPos.top, 0, cursorPos.bottom - cursorPos.top)

        showCrossDocHeadingPicker(editor, searchResult.id, searchResult.title, searchResult.spaceId, rect)
      }
    },

    render: () => {
      let component: ReactRenderer<PageMentionListHandle> | null = null
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
          component = new ReactRenderer(PageMentionList, {
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
  },
})

/**
 * After selecting a page via @, show a second dropdown with headings from that page.
 * If user selects a heading, inserts a headingRef node with cross-doc attrs.
 * If user presses Escape, nothing extra is inserted (just the pageMention).
 */
async function showCrossDocHeadingPicker(
  editor: any,
  pageId: number,
  pageTitle: string,
  spaceId: number | null,
  position: DOMRect,
) {
  let headings: HeadingDto[]
  try {
    headings = await referenceService.getPageHeadings(pageId)
  } catch {
    return
  }

  if (headings.length === 0) return

  const floatingEl = document.createElement('div')
  Object.assign(floatingEl.style, { position: 'absolute', zIndex: '50' })

  const component = new ReactRenderer(HeadingRefList, {
    props: {
      items: headings,
      command: (heading: HeadingDto) => {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'headingRef',
            attrs: {
              id: heading.id,
              label: heading.text,
              pageId: String(pageId),
              pageTitle,
              spaceId: spaceId ? String(spaceId) : null,
            },
          })
          .run()

        cleanup()
      },
    },
    editor,
  })

  if (component.element) floatingEl.appendChild(component.element)
  document.body.appendChild(floatingEl)

  const virtualEl = { getBoundingClientRect: () => position }
  const { x, y } = await computePosition(virtualEl, floatingEl, {
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  })
  Object.assign(floatingEl.style, { left: `${x}px`, top: `${y}px` })

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      cleanup()
      e.preventDefault()
      return
    }
    component?.ref?.onKeyDown({ event: e })
  }

  document.addEventListener('keydown', handleKeyDown)

  function cleanup() {
    document.removeEventListener('keydown', handleKeyDown)
    component?.destroy()
    floatingEl?.remove()
  }
}
