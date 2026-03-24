import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import { computePosition, flip, shift, offset } from '@floating-ui/dom'
import { Suggestion } from '@tiptap/suggestion'
import type { SuggestionOptions, SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import { SLASH_COMMANDS } from './slashCommands'
import type { SlashCommandItem } from './slashCommands'
import { SlashCommandList } from './SlashCommandList'
import type { SlashCommandListHandle } from './SlashCommandList'
import { EDITOR } from '@/config/constants'

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const suggestionConfig: Omit<SuggestionOptions<SlashCommandItem>, 'editor'> = {
  char: '/',

  items: ({ query }) => {
    const normalizedQuery = normalizeText(query)
    return SLASH_COMMANDS.filter((item) =>
      normalizeText(item.title).includes(normalizedQuery),
    ).slice(0, EDITOR.SLASH_COMMAND_MAX_RESULTS)
  },

  command: ({ editor, range, props }) => {
    props.command({ editor, range })
  },

  render: () => {
    let component: ReactRenderer<SlashCommandListHandle> | null = null
    let floatingEl: HTMLDivElement | null = null

    async function updatePosition(clientRect: (() => DOMRect | null) | null | undefined) {
      if (!floatingEl || !clientRect) return

      const rect = clientRect()
      if (!rect) return

      const virtualEl = {
        getBoundingClientRect: () => rect,
      }

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
      onStart: (props: SuggestionProps<SlashCommandItem>) => {
        component = new ReactRenderer(SlashCommandList, {
          props: {
            items: props.items,
            command: props.command,
          },
          editor: props.editor,
        })

        floatingEl = document.createElement('div')
        Object.assign(floatingEl.style, {
          position: 'absolute',
          zIndex: '50',
        })

        if (component.element) {
          floatingEl.appendChild(component.element)
        }
        document.body.appendChild(floatingEl)

        updatePosition(props.clientRect)
      },

      onUpdate: (props: SuggestionProps<SlashCommandItem>) => {
        component?.updateProps({
          items: props.items,
          command: props.command,
        })

        updatePosition(props.clientRect)
      },

      onKeyDown: (props: SuggestionKeyDownProps) => {
        if (props.event.key === 'Escape') {
          return true
        }
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
}

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: suggestionConfig,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
