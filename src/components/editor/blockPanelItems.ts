import type { Editor } from '@tiptap/core'

export interface BlockPanelItem {
  id: string
  title: string
  description: string
  icon: string
  category: BlockCategory
  action: (editor: Editor) => void
}

export type BlockCategory =
  | 'texto'
  | 'layout'
  | 'conteudo'
  | 'midia'
  | 'alertas'
  | 'templates'

export const BLOCK_CATEGORY_LABELS: Record<BlockCategory, string> = {
  texto: 'Texto',
  layout: 'Layout',
  conteudo: 'Conteudo',
  midia: 'Midia',
  alertas: 'Alertas',
  templates: 'Templates',
}

export const BLOCK_PANEL_ITEMS: BlockPanelItem[] = [
  // --- Texto ---
  {
    id: 'paragraph',
    title: 'Paragrafo',
    description: 'Texto simples',
    icon: 'Pilcrow',
    category: 'texto',
    action: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    id: 'heading1',
    title: 'Titulo 1',
    description: 'Titulo grande',
    icon: 'Heading1',
    category: 'texto',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    id: 'heading2',
    title: 'Titulo 2',
    description: 'Titulo medio',
    icon: 'Heading2',
    category: 'texto',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    id: 'heading3',
    title: 'Titulo 3',
    description: 'Titulo pequeno',
    icon: 'Heading3',
    category: 'texto',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },

  // --- Layout ---
  {
    id: 'columns-2',
    title: '2 Colunas',
    description: 'Layout de duas colunas',
    icon: 'Columns2',
    category: 'layout',
    action: (editor) => editor.chain().focus().insertColumns(2).run(),
  },
  {
    id: 'columns-3',
    title: '3 Colunas',
    description: 'Layout de tres colunas',
    icon: 'Columns3',
    category: 'layout',
    action: (editor) => editor.chain().focus().insertColumns(3).run(),
  },
  {
    id: 'columns-4',
    title: '4 Colunas',
    description: 'Layout de quatro colunas',
    icon: 'Columns4',
    category: 'layout',
    action: (editor) => editor.chain().focus().insertColumns(4).run(),
  },
  {
    id: 'section',
    title: 'Secao',
    description: 'Bloco com fundo e espaçamento',
    icon: 'PanelTop',
    category: 'layout',
    action: (editor) => editor.chain().focus().insertSection().run(),
  },
  {
    id: 'spacer',
    title: 'Espacador',
    description: 'Espaco vertical',
    icon: 'SeparatorHorizontal',
    category: 'layout',
    action: (editor) => editor.chain().focus().insertSpacer().run(),
  },

  // --- Conteudo ---
  {
    id: 'button',
    title: 'Botao',
    description: 'Botao com link',
    icon: 'MousePointerClick',
    category: 'conteudo',
    action: (editor) => editor.chain().focus().insertButton().run(),
  },
  {
    id: 'card',
    title: 'Card',
    description: 'Caixa com conteudo',
    icon: 'SquareStack',
    category: 'conteudo',
    action: (editor) => editor.chain().focus().insertCard().run(),
  },
  {
    id: 'accordion',
    title: 'Acordeao',
    description: 'Secoes expansiveis',
    icon: 'ListCollapse',
    category: 'conteudo',
    action: (editor) => editor.chain().focus().insertAccordion(3).run(),
  },
  {
    id: 'bullet-list',
    title: 'Lista com marcadores',
    description: 'Lista nao ordenada',
    icon: 'List',
    category: 'conteudo',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: 'ordered-list',
    title: 'Lista numerada',
    description: 'Lista ordenada',
    icon: 'ListOrdered',
    category: 'conteudo',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    id: 'blockquote',
    title: 'Citacao',
    description: 'Bloco de citacao',
    icon: 'Quote',
    category: 'conteudo',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: 'code-block',
    title: 'Bloco de codigo',
    description: 'Codigo formatado',
    icon: 'Code2',
    category: 'conteudo',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: 'hr',
    title: 'Linha horizontal',
    description: 'Separador visual',
    icon: 'Minus',
    category: 'conteudo',
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },

  // --- Midia ---
  {
    id: 'image',
    title: 'Imagem',
    description: 'Inserir imagem por upload ou URL',
    icon: 'ImageIcon',
    category: 'midia',
    action: (editor) => editor.chain().focus().setImage({ src: '' }).run(),
  },

  {
    id: 'video',
    title: 'Video',
    description: 'Inserir video por upload ou URL',
    icon: 'Video',
    category: 'midia',
    action: (editor) => editor.chain().focus().insertVideo().run(),
  },

  {
    id: 'embed',
    title: 'Embed',
    description: 'Incorporar site ou video externo',
    icon: 'Globe',
    category: 'midia',
    action: (editor) => editor.chain().focus().insertEmbed().run(),
  },

  // --- Alertas ---
  {
    id: 'callout-info',
    title: 'Informacao',
    description: 'Bloco informativo',
    icon: 'Info',
    category: 'alertas',
    action: (editor) => editor.chain().focus().insertCallout({ type: 'info' }).run(),
  },
  {
    id: 'callout-warning',
    title: 'Aviso',
    description: 'Bloco de aviso',
    icon: 'AlertTriangle',
    category: 'alertas',
    action: (editor) => editor.chain().focus().insertCallout({ type: 'warning' }).run(),
  },
  {
    id: 'callout-success',
    title: 'Sucesso',
    description: 'Bloco de sucesso',
    icon: 'CheckCircle2',
    category: 'alertas',
    action: (editor) => editor.chain().focus().insertCallout({ type: 'success' }).run(),
  },
  {
    id: 'callout-error',
    title: 'Erro',
    description: 'Bloco de erro',
    icon: 'XCircle',
    category: 'alertas',
    action: (editor) => editor.chain().focus().insertCallout({ type: 'error' }).run(),
  },

  // --- Templates ---
  {
    id: 'template-hero',
    title: 'Cabeçalho',
    description: 'Seção de destaque com título',
    icon: 'LayoutTemplate',
    category: 'templates',
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'section',
          attrs: { backgroundColor: '#1e293b', textColor: '#ffffff', paddingY: 'xl' },
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Título da página' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Descreva o propósito desta página em uma ou duas frases.' }] },
          ],
        })
        .run(),
  },
  {
    id: 'template-features',
    title: 'Grid de Cards',
    description: '3 cards em colunas',
    icon: 'LayoutGrid',
    category: 'templates',
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'columns',
          attrs: { count: 3 },
          content: [
            {
              type: 'column',
              content: [
                {
                  type: 'cardBlock',
                  attrs: { variant: 'bordered' },
                  content: [
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Tópico A' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Descrição breve deste tópico.' }] },
                  ],
                },
              ],
            },
            {
              type: 'column',
              content: [
                {
                  type: 'cardBlock',
                  attrs: { variant: 'bordered' },
                  content: [
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Tópico B' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Descrição breve deste tópico.' }] },
                  ],
                },
              ],
            },
            {
              type: 'column',
              content: [
                {
                  type: 'cardBlock',
                  attrs: { variant: 'bordered' },
                  content: [
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Tópico C' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Descrição breve deste tópico.' }] },
                  ],
                },
              ],
            },
          ],
        })
        .run(),
  },
  {
    id: 'template-destaque',
    title: 'Destaque',
    description: 'Seção com fundo para realçar conteúdo',
    icon: 'Megaphone',
    category: 'templates',
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'section',
          attrs: { backgroundColor: '#FDF4EA', textColor: '#000000', paddingY: 'lg' },
          content: [
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Informação importante' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Destaque aqui o conteúdo que merece atenção especial dos leitores.' }] },
          ],
        })
        .run(),
  },
  {
    id: 'template-feature-row',
    title: 'Imagem + Texto',
    description: 'Conteúdo lado a lado com imagem',
    icon: 'PanelLeftClose',
    category: 'templates',
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'columns',
          attrs: { count: 2 },
          content: [
            {
              type: 'column',
              content: [
                { type: 'image', attrs: { src: '', alt: 'Imagem ilustrativa' } },
              ],
            },
            {
              type: 'column',
              content: [
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Sobre este tópico' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'Explique o contexto e os detalhes relevantes. Este layout é ideal para combinar explicações com conteúdo visual.' }] },
              ],
            },
          ],
        })
        .run(),
  },
  {
    id: 'template-faq',
    title: 'FAQ',
    description: 'Perguntas frequentes',
    icon: 'HelpCircle',
    category: 'templates',
    action: (editor) => {
      editor
        .chain()
        .focus()
        .insertContent([
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Perguntas Frequentes' }] },
          {
            type: 'accordion',
            content: [
              {
                type: 'accordionItem',
                attrs: { title: 'Como funciona?', isOpen: true },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Explique o funcionamento aqui.' }] }],
              },
              {
                type: 'accordionItem',
                attrs: { title: 'Quem pode usar?', isOpen: false },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Descreva quem tem acesso.' }] }],
              },
              {
                type: 'accordionItem',
                attrs: { title: 'Onde encontro mais informações?', isOpen: false },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Indique referências e links úteis.' }] }],
              },
            ],
          },
        ])
        .run()
    },
  },
]
