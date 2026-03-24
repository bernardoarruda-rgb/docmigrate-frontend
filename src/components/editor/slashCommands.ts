import type { Editor, Range } from '@tiptap/core'

export interface SlashCommandItem {
  title: string
  description: string
  icon: string
  command: (props: { editor: Editor; range: Range }) => void
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    title: 'Paragrafo',
    description: 'Texto simples',
    icon: 'Pilcrow',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    },
  },
  {
    title: 'Titulo 1',
    description: 'Titulo grande',
    icon: 'Heading1',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run()
    },
  },
  {
    title: 'Titulo 2',
    description: 'Titulo medio',
    icon: 'Heading2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run()
    },
  },
  {
    title: 'Titulo 3',
    description: 'Titulo pequeno',
    icon: 'Heading3',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run()
    },
  },
  {
    title: 'Lista com marcadores',
    description: 'Lista nao ordenada',
    icon: 'List',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Lista numerada',
    description: 'Lista ordenada',
    icon: 'ListOrdered',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Citacao',
    description: 'Bloco de citacao',
    icon: 'Quote',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: 'Bloco de codigo',
    description: 'Codigo formatado',
    icon: 'Code2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: 'Linha horizontal',
    description: 'Separador visual',
    icon: 'Minus',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: 'Imagem',
    description: 'Inserir imagem por upload ou URL',
    icon: 'ImageIcon',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setImage({ src: '' }).run()
    },
  },
  {
    title: 'Video',
    description: 'Inserir video por upload ou URL',
    icon: 'Video',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertVideo().run()
    },
  },
  {
    title: 'Informacao',
    description: 'Bloco de informacao',
    icon: 'Info',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertCallout({ type: 'info' }).run()
    },
  },
  {
    title: 'Aviso',
    description: 'Bloco de aviso',
    icon: 'AlertTriangle',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertCallout({ type: 'warning' }).run()
    },
  },
  {
    title: 'Sucesso',
    description: 'Bloco de sucesso',
    icon: 'CheckCircle2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertCallout({ type: 'success' }).run()
    },
  },
  {
    title: 'Erro',
    description: 'Bloco de erro',
    icon: 'XCircle',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertCallout({ type: 'error' }).run()
    },
  },

  // --- Layout ---
  {
    title: '2 Colunas',
    description: 'Layout de duas colunas',
    icon: 'Columns2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertColumns(2).run()
    },
  },
  {
    title: '3 Colunas',
    description: 'Layout de tres colunas',
    icon: 'Columns3',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertColumns(3).run()
    },
  },
  {
    title: '4 Colunas',
    description: 'Layout de quatro colunas',
    icon: 'Columns4',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertColumns(4).run()
    },
  },
  {
    title: 'Secao',
    description: 'Bloco com fundo e espacamento',
    icon: 'PanelTop',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertSection().run()
    },
  },
  {
    title: 'Espacador',
    description: 'Espaco vertical',
    icon: 'SeparatorHorizontal',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertSpacer().run()
    },
  },
  {
    title: 'Botao',
    description: 'Botao com link',
    icon: 'MousePointerClick',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertButton().run()
    },
  },

  {
    title: 'Embed',
    description: 'Incorporar site ou video externo',
    icon: 'Globe',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertEmbed().run()
    },
  },

  // --- Conteudo ---
  {
    title: 'Card',
    description: 'Caixa com conteudo',
    icon: 'SquareStack',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertCard().run()
    },
  },
  {
    title: 'Acordeao',
    description: 'Secoes expansiveis (FAQ)',
    icon: 'ListCollapse',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertAccordion(3).run()
    },
  },

  // --- Templates ---
  {
    title: 'Cabeçalho',
    description: 'Seção de destaque com título',
    icon: 'LayoutTemplate',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'section',
          attrs: { backgroundColor: '#1e293b', textColor: '#ffffff', paddingY: 'xl' },
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Título da página' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Descreva o propósito desta página em uma ou duas frases.' }] },
          ],
        })
        .run()
    },
  },
  {
    title: 'Destaque',
    description: 'Seção com fundo para realçar conteúdo',
    icon: 'Megaphone',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'section',
          attrs: { backgroundColor: '#FDF4EA', textColor: '#000000', paddingY: 'lg' },
          content: [
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Informação importante' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Destaque aqui o conteúdo que merece atenção especial dos leitores.' }] },
          ],
        })
        .run()
    },
  },
]
