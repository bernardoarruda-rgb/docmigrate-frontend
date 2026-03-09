import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EDITOR } from '@/config/constants'
import type { Extensions } from '@tiptap/react'

export function getEditorExtensions(): Extensions {
  return [
    StarterKit.configure({
      heading: {
        levels: [...EDITOR.HEADING_LEVELS],
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: {
        class: 'text-primary underline cursor-pointer',
      },
    }),
    Placeholder.configure({
      placeholder: EDITOR.PLACEHOLDER,
    }),
  ]
}
