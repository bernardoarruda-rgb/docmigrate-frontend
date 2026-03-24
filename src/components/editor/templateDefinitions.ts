import type { JSONContent } from '@tiptap/react'

export interface PageTemplate {
  id: string
  title: string
  description: string
  icon: string
  content: JSONContent
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'blank',
    title: 'Em branco',
    description: 'Pagina vazia para criar do zero',
    icon: 'FileText',
    content: {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    },
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Hero, features e chamada para acao',
    icon: 'LayoutTemplate',
    content: {
      type: 'doc',
      content: [
        {
          type: 'section',
          attrs: { backgroundColor: '#1e293b', textColor: '#ffffff', paddingY: 'xl' },
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Bem-vindo ao nosso site' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Uma breve descricao do que oferecemos e por que voce deveria se interessar.' }] },
            { type: 'buttonBlock', attrs: { text: 'Comecar agora', href: '#', variant: 'primary', align: 'center' } },
          ],
        },
        { type: 'spacer', attrs: { size: 'lg' } },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Nossos Recursos' }] },
        {
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
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Recurso 1' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Descricao do primeiro recurso principal.' }] },
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
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Recurso 2' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Descricao do segundo recurso principal.' }] },
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
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Recurso 3' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Descricao do terceiro recurso principal.' }] },
                  ],
                },
              ],
            },
          ],
        },
        { type: 'spacer', attrs: { size: 'lg' } },
        {
          type: 'section',
          attrs: { backgroundColor: '#E5892B', textColor: '#ffffff', paddingY: 'lg' },
          content: [
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Pronto para comecar?' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Entre em contato e descubra como podemos ajudar.' }] },
            { type: 'buttonBlock', attrs: { text: 'Fale conosco', href: '#', variant: 'outline', align: 'center' } },
          ],
        },
      ],
    },
  },
  {
    id: 'documentation',
    title: 'Documentacao',
    description: 'Estrutura para documentar processos',
    icon: 'BookOpen',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Titulo da Documentacao' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Breve descricao do conteudo desta pagina.' }] },
        {
          type: 'callout',
          attrs: { type: 'info' },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Nota importante sobre esta documentacao.' }] },
          ],
        },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Visao Geral' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Descreva o contexto e objetivo aqui.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Passo a Passo' }] },
        {
          type: 'orderedList',
          content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Primeiro passo' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Segundo passo' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Terceiro passo' }] }] },
          ],
        },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Observacoes' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Informacoes adicionais relevantes.' }] },
      ],
    },
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Perguntas frequentes com acordeao',
    icon: 'HelpCircle',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Perguntas Frequentes' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Encontre respostas para as duvidas mais comuns.' }] },
        { type: 'spacer', attrs: { size: 'sm' } },
        {
          type: 'accordion',
          content: [
            {
              type: 'accordionItem',
              attrs: { title: 'Qual e o objetivo desta plataforma?', isOpen: true },
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Nossa plataforma centraliza toda a documentacao interna, facilitando o acesso e a manutencao do conhecimento.' }] },
              ],
            },
            {
              type: 'accordionItem',
              attrs: { title: 'Como posso criar uma nova pagina?', isOpen: false },
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Acesse o espaco desejado, clique em "Nova pagina" e escolha um template para comecar.' }] },
              ],
            },
            {
              type: 'accordionItem',
              attrs: { title: 'Quem pode editar o conteudo?', isOpen: false },
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Usuarios com role de Editor ou Admin podem criar e modificar paginas dentro dos espacos aos quais tem acesso.' }] },
              ],
            },
            {
              type: 'accordionItem',
              attrs: { title: 'Como organizo o conteudo em secoes?', isOpen: false },
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Use os blocos de layout (colunas, secoes, cards) para estruturar o conteudo visualmente.' }] },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'team',
    title: 'Equipe',
    description: 'Apresentacao de membros da equipe',
    icon: 'Users',
    content: {
      type: 'doc',
      content: [
        {
          type: 'section',
          attrs: { backgroundColor: '#f8fafc', paddingY: 'lg' },
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Nossa Equipe' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Conheca as pessoas por tras do projeto.' }] },
          ],
        },
        { type: 'spacer', attrs: { size: 'md' } },
        {
          type: 'columns',
          attrs: { count: 3 },
          content: [
            {
              type: 'column',
              content: [
                {
                  type: 'cardBlock',
                  attrs: { variant: 'elevated' },
                  content: [
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Nome do Membro' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Cargo / Funcao' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Breve descricao sobre o membro da equipe.' }] },
                  ],
                },
              ],
            },
            {
              type: 'column',
              content: [
                {
                  type: 'cardBlock',
                  attrs: { variant: 'elevated' },
                  content: [
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Nome do Membro' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Cargo / Funcao' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Breve descricao sobre o membro da equipe.' }] },
                  ],
                },
              ],
            },
            {
              type: 'column',
              content: [
                {
                  type: 'cardBlock',
                  attrs: { variant: 'elevated' },
                  content: [
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Nome do Membro' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Cargo / Funcao' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Breve descricao sobre o membro da equipe.' }] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
]
