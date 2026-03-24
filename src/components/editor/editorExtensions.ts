import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { SlashCommandExtension } from './SlashCommandExtension'
import { ImageExtension } from './ImageExtension'
import { CalloutExtension } from './CalloutExtension'
import { ColumnsExtension, ColumnExtension } from './ColumnsExtension'
import { SectionExtension } from './SectionExtension'
import { SpacerExtension } from './SpacerExtension'
import { ButtonExtension } from './ButtonExtension'
import { CardExtension } from './CardExtension'
import { AccordionExtension, AccordionItemExtension } from './AccordionExtension'
import { EmbedExtension } from './EmbedExtension'
import { VideoExtension } from './VideoExtension'
import { GlobalStyleExtension } from './GlobalStyleExtension'
import { CodeBlockViewExtension } from './CodeBlockViewExtension'
import { DragHandleExtension } from './DragHandleExtension'
import { PageMentionExtension } from './PageMentionExtension'
import { HeadingRefExtension } from './HeadingRefExtension'
import { EDITOR } from '@/config/constants'
import type { Extensions } from '@tiptap/react'

export function getEditorExtensions(): Extensions {
  return [
    StarterKit.configure({
      heading: {
        levels: [...EDITOR.HEADING_LEVELS],
      },
      dropcursor: {
        color: 'var(--color-primary)',
        width: 2,
      },
      codeBlock: false,
    }),
    CodeBlockViewExtension,
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
    ImageExtension.configure({
      inline: false,
      allowBase64: false,
    }),
    CalloutExtension,
    ColumnExtension,
    ColumnsExtension,
    SectionExtension,
    SpacerExtension,
    ButtonExtension,
    CardExtension,
    AccordionExtension,
    AccordionItemExtension,
    EmbedExtension,
    VideoExtension,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    GlobalStyleExtension,
    DragHandleExtension,
    PageMentionExtension,
    HeadingRefExtension,
    SlashCommandExtension,
  ]
}
