import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Link,
  Undo2,
  Redo2,
} from 'lucide-react'
import { LinkDialog } from './LinkDialog'

interface EditorToolbarProps {
  editor: Editor
}

interface ToolbarButtonProps {
  editor: Editor
  tooltip: string
  isActive: boolean
  onToggle: () => void
  icon: React.ReactNode
}

function ToolbarButton({
  tooltip,
  isActive,
  onToggle,
  icon,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            size="sm"
            pressed={isActive}
            onPressedChange={onToggle}
          >
            {icon}
          </Toggle>
        }
      />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function EditorToolbar({ editor }: EditorToolbarProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)

  return (
    <div className="flex items-center gap-1 flex-wrap border border-border bg-muted/30 p-1.5 rounded-t-lg">
      {/* Formatacao de texto */}
      <ToolbarButton
        editor={editor}
        tooltip="Negrito"
        isActive={editor.isActive('bold')}
        onToggle={() => editor.chain().focus().toggleBold().run()}
        icon={<Bold className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Italico"
        isActive={editor.isActive('italic')}
        onToggle={() => editor.chain().focus().toggleItalic().run()}
        icon={<Italic className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Sublinhado"
        isActive={editor.isActive('underline')}
        onToggle={() => editor.chain().focus().toggleUnderline().run()}
        icon={<Underline className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Tachado"
        isActive={editor.isActive('strike')}
        onToggle={() => editor.chain().focus().toggleStrike().run()}
        icon={<Strikethrough className="h-4 w-4" />}
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Titulos */}
      <ToolbarButton
        editor={editor}
        tooltip="Titulo 1"
        isActive={editor.isActive('heading', { level: 1 })}
        onToggle={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        icon={<Heading1 className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Titulo 2"
        isActive={editor.isActive('heading', { level: 2 })}
        onToggle={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        icon={<Heading2 className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Titulo 3"
        isActive={editor.isActive('heading', { level: 3 })}
        onToggle={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        icon={<Heading3 className="h-4 w-4" />}
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Listas */}
      <ToolbarButton
        editor={editor}
        tooltip="Lista com marcadores"
        isActive={editor.isActive('bulletList')}
        onToggle={() => editor.chain().focus().toggleBulletList().run()}
        icon={<List className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Lista numerada"
        isActive={editor.isActive('orderedList')}
        onToggle={() => editor.chain().focus().toggleOrderedList().run()}
        icon={<ListOrdered className="h-4 w-4" />}
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Blocos */}
      <ToolbarButton
        editor={editor}
        tooltip="Citacao"
        isActive={editor.isActive('blockquote')}
        onToggle={() => editor.chain().focus().toggleBlockquote().run()}
        icon={<Quote className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Bloco de codigo"
        isActive={editor.isActive('codeBlock')}
        onToggle={() => editor.chain().focus().toggleCodeBlock().run()}
        icon={<Code2 className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Linha horizontal"
        isActive={false}
        onToggle={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<Minus className="h-4 w-4" />}
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Link */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Toggle
              size="sm"
              pressed={editor.isActive('link')}
              onPressedChange={() => setLinkDialogOpen(true)}
            >
              <Link className="h-4 w-4" />
            </Toggle>
          }
        />
        <TooltipContent>Link</TooltipContent>
      </Tooltip>

      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        editor={editor}
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Desfazer/Refazer */}
      <ToolbarButton
        editor={editor}
        tooltip="Desfazer"
        isActive={false}
        onToggle={() => editor.chain().focus().undo().run()}
        icon={<Undo2 className="h-4 w-4" />}
      />
      <ToolbarButton
        editor={editor}
        tooltip="Refazer"
        isActive={false}
        onToggle={() => editor.chain().focus().redo().run()}
        icon={<Redo2 className="h-4 w-4" />}
      />
    </div>
  )
}

export { EditorToolbar }
