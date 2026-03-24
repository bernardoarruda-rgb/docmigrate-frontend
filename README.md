# DocMigrate Frontend

Interface da plataforma de documentacao modular DocMigrate.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS V4
- shadcn/ui
- React Query (@tanstack/react-query)
- React Hook Form + Zod
- Tiptap v3 (editor rico)
- React Router v7

## Pre-requisitos

- Node.js 22+
- API backend rodando em `http://localhost:5029`

## Setup

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variaveis de ambiente:
   ```bash
   cp .env.example .env
   ```

3. Iniciar dev server:
   ```bash
   npm run dev
   ```
   App disponivel em: `http://localhost:3000`

## Comandos

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Dev server com HMR |
| `npm run build` | Build de producao |
| `npm run preview` | Preview do build |
| `npx tsc --noEmit` | Type check |

## Estrutura

```
src/
├── components/       # Componentes reutilizaveis
│   ├── ui/           # shadcn/ui + custom
│   ├── editor/       # Tiptap editor
│   ├── layout/       # Header, Sidebar
│   ├── spaces/       # Cards e dialogs de espacos
│   ├── pages/        # Cards e dialogs de paginas
│   ├── settings/     # Painel de configuracoes
│   ├── export/       # Export PDF/DOCX
│   ├── import/       # Import HTML/MD/DOCX
│   └── site/         # Visualizacao publica
├── pages/            # Paginas (composicao apenas)
├── layouts/          # Layout wrappers
├── hooks/            # Custom hooks (React Query)
├── services/         # API calls
├── contexts/         # Auth, Theme
├── types/            # TypeScript interfaces
├── schemas/          # Zod schemas
├── config/           # Constantes, endpoints
└── lib/              # Utilidades
```

## Modos de Operacao

- **Standalone** (dev): Layout completo com sidebar + header
- **Iframe** (producao): Layout minimo, embarcado no BMS Core

## Convencoes

- Codigo em ingles, UI em portugues (PT-BR)
- Path alias: `@/` → `./src/`
- TypeScript strict (sem `any`)
- Texto dinamico sempre com `truncate` ou `line-clamp-N`
